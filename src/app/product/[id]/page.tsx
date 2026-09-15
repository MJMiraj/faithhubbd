import type { Metadata } from 'next';
import { db } from "@/lib/db";
import { InfoPage } from "@/components/layout/InfoPage";
import { AddToCartButton } from "./AddToCartButton";
import { ImageGallery } from "./ImageGallery";
import { ReviewSection } from "@/components/product/ReviewSection";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { ProductGrid } from "@/components/home/ProductGrid";
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const product = await db.product.findUnique({
    where: { id },
    include: { images: true }
  });

  if (!product) return { title: 'Product Not Found' };

  const primaryImage = product.images.find(img => img.isPrimary)?.url || product.images[0]?.url || "";

  return {
    title: `${product.name} | FaithHub BD`,
    description: product.description || `Buy ${product.name} at FaithHub BD for ৳${product.basePrice}`,
    openGraph: {
      title: product.name,
      description: product.description || `Buy ${product.name} at FaithHub BD`,
      images: [primaryImage],
      url: `https://faithhubbd.com/product/${id}`,
      type: 'website'
    },
    twitter: {
      card: 'summary_large_image',
      title: product.name,
      description: product.description || '',
      images: [primaryImage]
    }
  };
}

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  
  const product = await db.product.findUnique({
    where: { id, isActive: true },
    include: {
      category: true,
      images: {
        orderBy: { order: 'asc' }
      },
      attributes: true,
      inventory: true,
      reviews: {
        where: { isApproved: true },
        include: { user: { select: { firstName: true, lastName: true } } },
        orderBy: { createdAt: 'desc' }
      }
    }
  });

  if (!product) {
    return (
      <InfoPage 
        title="Product Unavailable" 
        description="The product you are looking for is currently unavailable or has been removed."
      />
    );
  }

  // Fetch Related Products (same category, exclude current)
  const relatedProductsRaw = await db.product.findMany({
    where: { 
      categoryId: product.categoryId, 
      id: { not: product.id },
      isActive: true 
    },
    take: 4,
    include: {
      category: true,
      images: { where: { isPrimary: true }, take: 1 },
      inventory: true
    }
  });

  const relatedProducts = relatedProductsRaw.map((p: any) => ({
    id: p.id,
    name: p.name,
    price: p.basePrice,
    category: p.category.name,
    imageUrl: p.images[0]?.url || "",
    isOffer: p.isOffer,
    isCombo: p.isCombo,
    isUpcoming: p.isUpcoming,
    isPreBooking: p.isPreBooking,
    discountPercent: p.discountPercent,
    isOutOfStock: p.inventory ? p.inventory.quantity <= 0 : true,
  }));

  const primaryImage = product.images.find(img => img.isPrimary)?.url || product.images[0]?.url || "";
  const sortedImages = product.images.sort((a, b) => a.order - b.order);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 transition-colors duration-500 pt-32 pb-24 w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row gap-16 lg:gap-24 mb-24">
        
        {/* Product Image Gallery */}
        <div className="w-full md:w-1/2">
          <div className="sticky top-32">
            <ImageGallery images={sortedImages} />
          </div>
        </div>

        {/* Product Details */}
        <div className="w-full md:w-1/2 flex flex-col">
          <p className="text-xs text-gray-400 uppercase tracking-widest font-bold mb-4">{product.category.name}</p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-black text-black dark:text-white tracking-tighter leading-[1.1] mb-6">
            {product.name}
          </h1>
          <p className="text-3xl font-black text-gray-900 dark:text-gray-100 mb-10">৳ {product.basePrice}</p>
          
          <div className="prose prose-lg dark:prose-invert text-gray-600 dark:text-gray-300 mb-12">
            <p>{product.description}</p>
          </div>

          {product.attributes && product.attributes.length > 0 && (
            <div className="mb-12">
              <h3 className="text-sm font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-6">Specifications</h3>
              <div className="bg-gray-50 dark:bg-gray-900 rounded-3xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-800">
                <table className="w-full text-sm text-left">
                  <tbody>
                    {product.attributes.map((attr, index) => (
                      <tr key={attr.id} className={index !== product.attributes.length - 1 ? "border-b border-gray-200 dark:border-gray-800" : ""}>
                        <td className="px-6 py-4 font-bold text-gray-900 dark:text-gray-100 w-1/3 bg-white dark:bg-gray-950/50">{attr.name}</td>
                        <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{attr.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          <div className="pt-8 border-t border-gray-100 dark:border-gray-800">
            <AddToCartButton 
              product={{
                id: product.id,
                name: product.name,
                price: product.basePrice,
                category: product.category.name,
                imageUrl: primaryImage,
                isOutOfStock: (product as any).inventory ? (product as any).inventory.quantity <= 0 : true
              }} 
              attributes={product.attributes}
            />
          </div>
        </div>
      </div>

      <ReviewSection 
        productId={product.id}
        reviews={product.reviews as any}
        isLoggedIn={!!session?.user}
      />

      {/* You Might Also Like */}
      {relatedProducts.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-32">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl md:text-5xl font-heading font-black text-black dark:text-white mb-2">You Might Also Like</h2>
              <p className="text-gray-500 dark:text-gray-400 font-medium">Discover more products in {product.category.name}</p>
            </div>
            <Link 
              href={`/shop?category=${product.category.slug}`} 
              className="hidden md:flex items-center gap-2 text-brand font-bold hover:gap-4 transition-all"
            >
              View Category <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
          <ProductGrid products={relatedProducts} />
        </div>
      )}
    </div>
  );
}
