import { db } from "@/lib/db";
import { ProductGrid } from "@/components/home/ProductGrid";
import { InfoPage } from "@/components/layout/InfoPage";
import { FilterSidebar } from "@/components/shop/FilterSidebar";

type SearchParams = { [key: string]: string | string[] | undefined };

export default async function ShopPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const params = await searchParams;
  
  // Extract Filters
  const q = typeof params.q === "string" ? params.q : undefined;
  const categoryFilter = typeof params.category === "string" ? params.category : undefined;
  const sortFilter = typeof params.sort === "string" ? params.sort : "newest";
  const minPrice = typeof params.minPrice === "string" ? parseInt(params.minPrice) : undefined;
  const maxPrice = typeof params.maxPrice === "string" ? parseInt(params.maxPrice) : undefined;
  const sizeFilter = typeof params.size === "string" ? params.size.split(',') : undefined;
  const colorFilter = typeof params.color === "string" ? params.color.split(',') : undefined;

  // Build Prisma Where Clause
  const where: any = { isActive: true };
  
  if (q) {
    where.OR = [
      { name: { contains: q } },
      { description: { contains: q } }
    ];
  }

  if (categoryFilter) {
    where.category = { slug: categoryFilter };
  }
  
  if (minPrice !== undefined || maxPrice !== undefined) {
    where.basePrice = {};
    if (minPrice !== undefined && !isNaN(minPrice)) where.basePrice.gte = minPrice;
    if (maxPrice !== undefined && !isNaN(maxPrice)) where.basePrice.lte = maxPrice;
  }

  if (sizeFilter || colorFilter) {
    where.variants = {
      some: {
        values: {
          some: {
            OR: [
              ...(sizeFilter ? sizeFilter.map(s => ({ attributeName: 'Size', value: s })) : []),
              ...(colorFilter ? colorFilter.map(c => ({ attributeName: 'Color', value: c })) : [])
            ]
          }
        }
      }
    };
  }

  // Build Prisma OrderBy Clause
  let orderBy: any = { createdAt: 'desc' }; // default newest
  if (sortFilter === "price_asc") orderBy = { basePrice: 'asc' };
  if (sortFilter === "price_desc") orderBy = { basePrice: 'desc' };
  if (sortFilter === "name_asc") orderBy = { name: 'asc' };

  // Fetch Categories for Sidebar
  const categories = await db.category.findMany({
    select: { id: true, name: true, slug: true },
    orderBy: { name: 'asc' }
  });

  // Fetch Products
  const dbProducts = await db.product.findMany({
    where,
    orderBy,
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
    <div className="min-h-screen bg-white dark:bg-gray-950 transition-colors duration-500 pt-32 pb-24 w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-5xl md:text-6xl font-heading font-black tracking-tighter text-black dark:text-white mb-10">
          Shop Collection
        </h1>
        
        <div className="flex flex-col md:flex-row gap-12">
          {/* Sidebar */}
          <FilterSidebar categories={categories} />
          
          {/* Main Content */}
          <div className="flex-1">
            {products.length === 0 ? (
              <div className="bg-gray-50 dark:bg-gray-900 rounded-3xl p-12 text-center border border-gray-100 dark:border-gray-800">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No products found</h3>
                <p className="text-gray-500 dark:text-gray-400">Try adjusting your filters to see more results.</p>
              </div>
            ) : (
              <ProductGrid products={products} />
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
