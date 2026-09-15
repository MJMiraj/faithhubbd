"use client";

import { motion } from "framer-motion";
import { ShoppingCart } from "lucide-react";
import Link from "next/link";
import { useCartStore } from "@/store/cartStore";
import { Price } from "@/components/ui/Price";

interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  imageUrl: string;
  isOffer?: boolean;
  isCombo?: boolean;
  isUpcoming?: boolean;
  isPreBooking?: boolean;
  discountPercent?: number;
  isOutOfStock?: boolean;
}

export function ProductGrid({ products }: { products: Product[] }) {
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = (product: Product) => {
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      imageUrl: product.imageUrl,
    });
    // Normally you'd show a toast notification here
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10">
      {products.map((product, index) => (
        <motion.div
          key={product.id}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          className="group"
        >
          <div className="relative aspect-[4/5] bg-gray-100 dark:bg-gray-900 rounded-[1.5rem] overflow-hidden mb-6 shadow-sm border border-transparent hover:border-gray-200 dark:hover:border-gray-800 transition-colors">
            <Link href={`/product/${product.id}`}>
              <img 
                src={product.imageUrl} 
                alt={product.name} 
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-1000 ease-out mix-blend-multiply dark:mix-blend-normal"
              />
            </Link>
            
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 dark:group-hover:bg-white/5 transition-colors pointer-events-none" />
            
            {/* Badges */}
            <div className="absolute top-4 left-4 flex flex-col gap-2 z-10 pointer-events-none">
              {product.isOffer && product.discountPercent ? (
                <span className="bg-red-600 text-white text-xs font-black px-3 py-1.5 rounded-full shadow-lg">
                  -{product.discountPercent}% OFF
                </span>
              ) : null}
              {product.isCombo && (
                <span className="bg-purple-600 text-white text-xs font-black px-3 py-1.5 rounded-full shadow-lg">
                  COMBO
                </span>
              )}
              {product.isUpcoming && (
                <span className="bg-blue-600 text-white text-xs font-black px-3 py-1.5 rounded-full shadow-lg">
                  UPCOMING
                </span>
              )}
              {product.isPreBooking && !product.isUpcoming && (
                <span className="bg-amber-500 text-black text-xs font-black px-3 py-1.5 rounded-full shadow-lg">
                  PRE-BOOK
                </span>
              )}
              {product.isOutOfStock && !product.isUpcoming && (
                <span className="bg-gray-900 text-white text-xs font-black px-3 py-1.5 rounded-full shadow-lg">
                  OUT OF STOCK
                </span>
              )}
            </div>

            <button 
              onClick={() => handleAddToCart(product)}
              disabled={product.isUpcoming || product.isOutOfStock}
              className="absolute bottom-6 left-1/2 -translate-x-1/2 translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 bg-black dark:bg-white text-white dark:text-black px-6 py-4 rounded-full font-bold text-sm shadow-2xl hover:scale-105 transition-all flex items-center gap-2 whitespace-nowrap z-10 disabled:opacity-50 disabled:hover:scale-100"
            >
              <ShoppingCart className="w-4 h-4" /> {product.isUpcoming ? 'Coming Soon' : product.isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
            </button>
          </div>
          
          <div className="px-2">
            <p className="text-xs text-gray-400 uppercase tracking-widest font-bold mb-2">{product.category}</p>
            <Link href={`/product/${product.id}`}>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1 line-clamp-1 hover:opacity-70 transition-opacity">{product.name}</h3>
            </Link>
            <div className="flex items-center gap-3">
              {product.isOffer && product.discountPercent && product.discountPercent > 0 ? (
                <>
                  <p className="font-bold text-lg text-brand">
                    <Price amount={product.price * (1 - (product.discountPercent / 100))} />
                  </p>
                  <p className="text-sm text-gray-400 line-through">
                    <Price amount={product.price} />
                  </p>
                </>
              ) : (
                <p className="text-base text-gray-600 dark:text-gray-300 font-medium">
                  <Price amount={product.price} />
                </p>
              )}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
