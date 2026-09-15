import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await db.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const { items } = await req.json();

    if (!Array.isArray(items)) {
      return NextResponse.json({ error: 'Invalid cart format' }, { status: 400 });
    }

    // Upsert Cart
    let cart = await db.cart.findUnique({ where: { userId: user.id } });
    
    if (!cart) {
      cart = await db.cart.create({ data: { userId: user.id } });
    }

    // Clear existing items and replace with new ones (simple sync strategy)
    await db.cartItem.deleteMany({ where: { cartId: cart.id } });

    if (items.length > 0) {
      await db.cartItem.createMany({
        data: items.map((item: any) => ({
          cartId: cart!.id,
          productId: item.productId || item.id,
          quantity: item.quantity,
          selectedColor: item.selectedColor,
          selectedSize: item.selectedSize
        }))
      });
    }

    return NextResponse.json({ success: true, message: 'Cart synced' });

  } catch (error) {
    console.error('Cart sync error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ items: [] });
    }

    const user = await db.user.findUnique({
      where: { email: session.user.email },
      include: {
        cart: {
          include: {
            items: {
              include: { product: { include: { images: true } } }
            }
          }
        }
      }
    });

    if (!user?.cart) {
      return NextResponse.json({ items: [] });
    }

    // Map db items to standard cart items format
    const formattedItems = user.cart.items.map((item: any) => ({
      id: item.productId, // Zustand uses 'id' as productId usually
      productId: item.productId,
      name: item.product.name,
      price: item.product.basePrice,
      quantity: item.quantity,
      selectedColor: item.selectedColor,
      selectedSize: item.selectedSize,
      imageUrl: item.product.images?.find((img: any) => img.isPrimary)?.url || item.product.images?.[0]?.url || ''
    }));

    return NextResponse.json({ items: formattedItems });

  } catch (error) {
    console.error('Cart fetch error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
