import { Resend } from 'resend';
import { OrderReceiptEmail } from '@/emails/OrderReceipt';

const resend = new Resend(process.env.RESEND_API_KEY || 'mock');

export async function sendOrderReceiptEmail(
  toEmail: string,
  customerName: string,
  orderNumber: string,
  totalAmount: number,
  items: { name: string; quantity: number; price: number; variant?: string | null }[]
) {
  if (!process.env.RESEND_API_KEY || process.env.RESEND_API_KEY.includes('mock')) {
    console.warn("[Email Mock] Sending receipt to:", toEmail, "for order", orderNumber);
    return { success: true, message: "Mock email sent" };
  }

  try {
    const data = await resend.emails.send({
      from: 'FaithHub BD <orders@faithhub.bd>', // Need a verified domain in production
      to: [toEmail],
      subject: `Your Order Receipt - #${orderNumber}`,
      react: OrderReceiptEmail({ customerName, orderNumber, totalAmount, items }) as React.ReactElement,
    });

    return { success: true, data };
  } catch (error) {
    console.error("Failed to send email:", error);
    return { success: false, error };
  }
}

import { AbandonedCartEmail } from '@/emails/AbandonedCart';

export async function sendAbandonedCartEmail(
  toEmail: string,
  customerName: string,
  checkoutUrl: string
) {
  if (!process.env.RESEND_API_KEY || process.env.RESEND_API_KEY.includes('mock')) {
    console.warn("[Email Mock] Sending abandoned cart email to:", toEmail);
    return { success: true, message: "Mock email sent" };
  }

  try {
    const data = await resend.emails.send({
      from: 'FaithHub BD <hello@faithhub.bd>', 
      to: [toEmail],
      subject: `Did you forget something, ${customerName}?`,
      react: AbandonedCartEmail({ customerName, checkoutUrl }) as React.ReactElement,
    });

    return { success: true, data };
  } catch (error) {
    console.error("Failed to send abandoned cart email:", error);
    return { success: false, error };
  }
}
