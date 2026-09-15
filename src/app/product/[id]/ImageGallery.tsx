"use client";

import { useState } from "react";

export function ImageGallery({ images }: { images: { id: string, url: string }[] }) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (!images || images.length === 0) {
    return (
      <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-gray-100 flex items-center justify-center text-gray-400 font-bold">
        No Image Available
      </div>
    );
  }

  return (
    <div className="w-full space-y-4">
      {/* Main Image */}
      <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-gray-100 relative shadow-sm border border-gray-100">
        <img 
          src={images[activeIndex].url} 
          alt="Product Image"
          className="w-full h-full object-cover transition-opacity duration-300"
        />
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-4 overflow-x-auto pb-2 snap-x">
          {images.map((img, idx) => (
            <button 
              key={img.id}
              onClick={() => setActiveIndex(idx)}
              className={`relative aspect-square w-24 rounded-xl overflow-hidden shrink-0 border-2 transition-all ${
                activeIndex === idx ? "border-brand opacity-100" : "border-transparent opacity-60 hover:opacity-100"
              }`}
            >
              <img src={img.url} className="w-full h-full object-cover" alt="Thumbnail" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
