"use client";

import { useState } from "react";
import { Heart } from "lucide-react";

export function WishlistButton({ productId, initialIsSaved = false }: { productId: string, initialIsSaved?: boolean }) {
  const [isSaved, setIsSaved] = useState(initialIsSaved);
  const [isLoading, setIsLoading] = useState(false);

  const toggleWishlist = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/wishlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId })
      });
      const data = await res.json();
      if (data.success) {
        setIsSaved(data.saved);
      } else {
        alert(data.error || "Failed to update wishlist");
      }
    } catch (e) {
      alert("Error updating wishlist");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button 
      onClick={toggleWishlist}
      disabled={isLoading}
      className={`p-3 rounded-xl border flex items-center justify-center transition-all ${
        isSaved 
          ? 'bg-red-50 border-red-200 text-red-500 hover:bg-red-100 dark:bg-red-900/20 dark:border-red-900/50' 
          : 'bg-white border-gray-200 text-gray-500 hover:border-red-200 hover:text-red-500 dark:bg-gray-900 dark:border-gray-800'
      }`}
    >
      <Heart className={`w-5 h-5 ${isSaved ? 'fill-red-500' : ''}`} />
    </button>
  );
}
