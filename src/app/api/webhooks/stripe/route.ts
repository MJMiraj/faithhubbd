import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { db } from '@/lib/db';
import { sendOrderReceiptEmail } from '@/lib/email';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'mock', {
  apiVersion: '2025-01-27.acacia' as any,
});

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET || 'mock';

export async function POST(req: Request) {
  const payload = await req.text();
  const sig = req.headers.get('stripe-signature');

  let event;

  try {
    if (!sig) throw new Error("Missing stripe signature");
    event = stripe.webhooks.constructEvent(payload, sig, endpointSecret);
  } catch (err: any) {
    console.error(`Webhook signature verification failed: ${err.message}`);
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  // Handle the checkout.session.completed event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;

    try {
      const order = await db.order.findUnique({
        where: { stripeSessionId: session.id },
        include: { user: true, items: { include: { product: true } } }
      });

      if (order) {
        await db.order.update({
          where: { id: order.id },
          data: { 
            paymentStatus: 'PAID',
            status: 'PROCESSING'
          },
        });

        await db.orderStatusHistory.create({
          data: {
            orderId: order.id,
            status: 'PROCESSING',
            notes: 'Payment received via Stripe.'
          }
        });

        // Ensure a STRIPE PaymentMethod exists in the db
        let pm = await db.paymentMethod.findUnique({ where: { name: 'Stripe' } });
        if (!pm) {
          pm = await db.paymentMethod.create({ data: { name: 'Stripe' } });
        }

        // Also track payment in Payment model
        await db.payment.upsert({
          where: { orderId: order.id },
          update: {
            status: 'COMPLETED',
            transactionId: session.payment_intent as string || session.id,
          },
          create: {
            orderId: order.id,
            amount: order.totalAmount,
            status: 'COMPLETED',
            transactionId: session.payment_intent as string || session.id,
            paymentMethodId: pm.id
          }
        });

        // Send Email
        try {
          const emailItems = order.items.map(item => ({
            name: item.product.name,
            quantity: item.quantity,
            price: item.price,
            variant: item.variant
          }));
          await sendOrderReceiptEmail(
            order.user.email,
            order.user.firstName || 'Customer',
            order.orderNumber,
            order.totalAmount,
            emailItems
          );
        } catch (e) {
          console.error("Failed to send Stripe receipt email:", e);
        }
      }
    } catch (err) {
      console.error("Failed to update order status:", err);
      return NextResponse.json({ error: "Database update failed" }, { status: 500 });
    }
  }

  return NextResponse.json({ received: true });
}
