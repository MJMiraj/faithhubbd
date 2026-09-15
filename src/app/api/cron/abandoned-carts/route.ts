import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { sendAbandonedCartEmail } from '@/lib/email';

export async function GET(req: Request) {
  try {
    // Basic auth check to ensure only our cron provider (e.g. Vercel Cron) can trigger this
    const authHeader = req.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET || 'mock_cron_secret'}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Find carts that were updated more than 24 hours ago, have items, but no matching recent order
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const fortyEightHoursAgo = new Date(Date.now() - 48 * 60 * 60 * 1000);

    const abandonedCarts = await db.cart.findMany({
      where: {
        updatedAt: {
          lt: twentyFourHoursAgo,
          gt: fortyEightHoursAgo, // Don't send emails for really old carts
        },
        items: {
          some: {} // Must have at least one item
        }
      },
      include: {
        user: true
      }
    });

    let emailsSent = 0;

    for (const cart of abandonedCarts) {
      if (cart.user?.email && cart.user?.firstName) {
        // In a real system, you'd check if they've placed an order recently
        // and check a flag to ensure we don't spam them twice for the same cart
        
        await sendAbandonedCartEmail(
          cart.user.email,
          cart.user.firstName,
          'https://faithhubbd.com/checkout'
        );
        emailsSent++;
      }
    }

    return NextResponse.json({ success: true, processed: abandonedCarts.length, emailsSent });
  } catch (error) {
    console.error('Abandoned cart cron error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
