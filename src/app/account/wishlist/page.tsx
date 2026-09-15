import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { ProductGrid } from "@/components/home/ProductGrid";
import { Heart } from "lucide-react";
import Link from "next/link";

export default async function WishlistPage() {
  const session = await getServerSession(authOptions);
  
  const user = await db.user.findUnique({
    where: { email: session?.user?.email || "" }
  });

  if (!user) return null;

  const wishlistedItems = await db.wishlist.findMany({
    where: { userId: user.id },
    include: {
      product: {
        include: {
          category: true,
          images: {
            where: { isPrimary: true },
            take: 1
          }
        }
      }
    }
  });

  const products = wishlistedItems.map(w => ({
    id: w.product.id,
    name: w.product.name,
    price: w.product.basePrice,
    category: w.product.category.name,
    imageUrl: w.product.images[0]?.url || "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=2070&auto=format&fit=crop",
    isOffer: w.product.isOffer,
    isCombo: w.product.isCombo,
    isUpcoming: w.product.isUpcoming,
    isPreBooking: w.product.isPreBooking,
    discountPercent: w.product.discountPercent ?? undefined,
  }));

  return (
    <div className="bg-white dark:bg-black rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-6">My Wishlist</h2>
      
      {products.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 dark:bg-gray-900/50 rounded-2xl border border-gray-100 dark:border-gray-800 flex flex-col items-center">
          <div className="w-16 h-16 bg-brand/10 text-brand rounded-full flex items-center justify-center mb-4">
            <Heart className="w-8 h-8" />
          </div>
          <p className="text-gray-500 dark:text-gray-400 font-medium mb-6">Your wishlist is empty.</p>
          <Link href="/shop" className="bg-black dark:bg-white text-white dark:text-black px-6 py-3 rounded-full font-bold text-sm tracking-widest uppercase hover:scale-105 transition-transform">
            Start Shopping
          </Link>
        </div>
      ) : (
        <ProductGrid products={products} />
      )}
    </div>
  );
}
