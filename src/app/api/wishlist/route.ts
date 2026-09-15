import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Please log in to use the wishlist.' }, { status: 401 });
    }

    const user = await db.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const { productId } = await req.json();

    const existing = await db.wishlist.findUnique({
      where: {
        userId_productId: {
          userId: user.id,
          productId
        }
      }
    });

    if (existing) {
      await db.wishlist.delete({ where: { id: existing.id } });
      return NextResponse.json({ success: true, saved: false });
    } else {
      await db.wishlist.create({
        data: {
          userId: user.id,
          productId
        }
      });
      return NextResponse.json({ success: true, saved: true });
    }

  } catch (error) {
    console.error('Wishlist error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
