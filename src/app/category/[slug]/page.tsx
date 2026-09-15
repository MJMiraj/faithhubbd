import { db } from "@/lib/db";
import { ProductGrid } from "@/components/home/ProductGrid";
import { InfoPage } from "@/components/layout/InfoPage";

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  if (slug === 'new') {
    const newProducts = await db.product.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' },
      take: 12,
      include: {
        category: true,
        images: { where: { isPrimary: true }, take: 1 },
        inventory: true
      }
    });

    const products = newProducts.map((p: any) => ({
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
      <div className="min-h-screen bg-white dark:bg-gray-950 transition-colors duration-500 pt-32 pb-24 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-5xl md:text-6xl font-heading font-black tracking-tighter text-black dark:text-white mb-16 capitalize">
            New Arrivals
          </h1>
          <ProductGrid products={products} />
        </div>
      </div>
    );
  }

  const category = await db.category.findUnique({
    where: { slug }
  });

  if (!category) {
    // If category isn't in DB yet, show a beautiful coming soon page instead of a hard 404
    return (
      <InfoPage 
        title={`${slug.charAt(0).toUpperCase() + slug.slice(1)} Collection`} 
        description="This collection is currently being updated. Discover our latest apparel soon."
      />
    );
  }

  const dbProducts = await db.product.findMany({
    where: { 
      categoryId: category.id,
      isActive: true 
    },
    include: {
      category: true,
      images: {
        where: { isPrimary: true },
        take: 1
      },
      inventory: true
    }
  });

  if (dbProducts.length === 0) {
    return (
      <InfoPage 
        title={`${category.name} Collection`} 
        description="We are currently restocking this collection. Please check back soon."
      />
    );
  }

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
    <div className="min-h-screen bg-white dark:bg-gray-950 transition-colors duration-500 pt-32 pb-24 w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-5xl md:text-6xl font-heading font-black tracking-tighter text-black dark:text-white mb-16 capitalize">
          {category.name}
        </h1>
        <ProductGrid products={products} />
      </div>
    </div>
  );
}
