"use client";

import { useCartStore } from "@/store/cartStore";
import { ShoppingBag, Zap, Minus, Plus } from "lucide-react";
import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";

export function AddToCartButton({ product, attributes }: { product: any, attributes: any[] }) {
  const addItem = useCartStore((state) => state.addItem);
  const router = useRouter();

  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);

  // Extract color and size from attributes using flexible name matching
  const colors = useMemo(() => {
    const attr = attributes?.find(a => a.name.toLowerCase().includes("color"));
    return attr ? attr.value.split(/[,|-]/).map((s: string) => s.trim()).filter(Boolean) : [];
  }, [attributes]);

  const sizes = useMemo(() => {
    const attr = attributes?.find(a => a.name.toLowerCase().includes("size"));
    return attr ? attr.value.split(/[,|-]/).map((s: string) => s.trim()).filter(Boolean) : [];
  }, [attributes]);

  const hasColors = colors.length > 0;
  const hasSizes = sizes.length > 0;

  // Determine if ready to add to cart
  const isReady = (!hasColors || selectedColor) && (!hasSizes || selectedSize);

  const [isAdded, setIsAdded] = useState(false);

  const handleAddToCart = () => {
    if (!isReady) return;
    
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity,
      imageUrl: product.imageUrl,
      selectedColor: selectedColor || undefined,
      selectedSize: selectedSize || undefined,
    });
    
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const handleBuyNow = () => {
    if (!isReady) return;
    handleAddToCart();
    router.push("/checkout");
  };

  return (
    <div className="space-y-6">
      {/* Variants */}
      {(hasColors || hasSizes) && (
        <div className="space-y-4 pt-4 border-t border-gray-100">
          
          {hasColors && (
            <div>
              <p className="text-sm font-bold text-gray-900 mb-2">Color</p>
              <div className="flex flex-wrap gap-2">
                {colors.map((color: string) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`px-4 py-2 text-sm font-bold rounded-xl border-2 transition-all ${
                      selectedColor === color 
                        ? "border-brand bg-brand/5 text-brand" 
                        : "border-gray-200 text-gray-600 hover:border-brand/50 hover:bg-gray-50"
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          )}

          {hasSizes && (
            <div>
              <p className="text-sm font-bold text-gray-900 mb-2">Size</p>
              <div className="flex flex-wrap gap-2">
                {sizes.map((size: string) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`min-w-[3rem] px-3 py-2 text-sm font-bold rounded-xl border-2 transition-all flex items-center justify-center ${
                      selectedSize === size 
                        ? "border-brand bg-brand/5 text-brand" 
                        : "border-gray-200 text-gray-600 hover:border-brand/50 hover:bg-gray-50"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Quantity & Actions */}
      <div className="pt-4 border-t border-gray-100">
        <p className="text-sm font-bold text-gray-900 mb-2">Quantity</p>
        <div className="flex items-center gap-4 mb-6">
          <div className="flex items-center bg-gray-50 border border-gray-200 rounded-xl p-1">
            <button 
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="p-2 text-gray-500 hover:text-brand hover:bg-white rounded-lg transition-colors"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="w-12 text-center font-bold text-gray-900">{quantity}</span>
            <button 
              onClick={() => setQuantity(quantity + 1)}
              className="p-2 text-gray-500 hover:text-brand hover:bg-white rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button 
            onClick={handleAddToCart}
            disabled={!isReady || product.isOutOfStock}
            className={`flex-1 py-4 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-2 ${
              isAdded 
                ? "bg-green-500 border-2 border-green-500 text-white"
                : (isReady && !product.isOutOfStock)
                ? "bg-white border-2 border-brand text-brand hover:bg-brand/5" 
                : "bg-gray-100 border-2 border-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            <ShoppingBag className="w-5 h-5" /> {product.isOutOfStock ? "Out of Stock" : isAdded ? "Added!" : "Add to Cart"}
          </button>
          
          <button 
            onClick={handleBuyNow}
            disabled={!isReady || product.isOutOfStock}
            className={`flex-1 py-4 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-2 ${
              (isReady && !product.isOutOfStock)
                ? "bg-brand border-2 border-brand text-white hover:bg-brand-dark shadow-lg shadow-brand/20" 
                : "bg-gray-200 border-2 border-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            <Zap className="w-5 h-5" /> Buy Now
          </button>
        </div>
        
        {product.isOutOfStock ? (
          <p className="text-red-500 text-sm mt-3 font-bold text-center p-3 bg-red-50 dark:bg-red-900/20 rounded-xl">
            This item is currently out of stock.
          </p>
        ) : !isReady ? (
          <p className="text-red-500 text-sm mt-3 font-medium text-center">
            Please select {hasColors && !selectedColor ? "Color" : ""} {hasColors && !selectedColor && hasSizes && !selectedSize ? "and" : ""} {hasSizes && !selectedSize ? "Size" : ""}
          </p>
        ) : null}
      </div>
    </div>
  );
}
