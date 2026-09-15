import Link from "next/link";
import { db } from "@/lib/db";
import { ProductGrid } from "./ProductGrid";

export async function BestSellers() {
  const dbProducts = await db.product.findMany({
    where: { isActive: true },
    take: 4,
    orderBy: { createdAt: 'desc' },
    include: {
      category: true,
      images: {
        where: { isPrimary: true },
        take: 1
      },
      inventory: true
    }
  });

  const products = dbProducts.map((p: any) => ({
    id: p.id,
    name: p.name,
    price: p.basePrice,
    category: p.category.name,
    imageUrl: p.images[0]?.url || "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=2070&auto=format&fit=crop",
    isOffer: p.isOffer,
    isCombo: p.isCombo,
    isUpcoming: p.isUpcoming,
    isPreBooking: p.isPreBooking,
    discountPercent: p.discountPercent,
    isOutOfStock: p.inventory ? p.inventory.quantity <= 0 : true,
  }));

  return (
    <section className="py-24 md:py-32 bg-white dark:bg-gray-950 w-full transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-16">
          <div>
            <h2 className="text-4xl md:text-5xl font-heading font-black tracking-tighter text-black dark:text-white mb-3">
              Best Sellers
            </h2>
            <p className="text-gray-500 dark:text-gray-400 text-lg">Our most popular apparel, loved by customers.</p>
          </div>
          <Link href="/shop" className="hidden md:inline-block text-sm font-bold uppercase tracking-widest text-gray-500 hover:text-black dark:hover:text-white transition-colors">
            View All Products
          </Link>
        </div>

        <ProductGrid products={products} />
      </div>
    </section>
  );
}
