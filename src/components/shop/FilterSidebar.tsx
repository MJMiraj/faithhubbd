"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";
import { Filter, X } from "lucide-react";

type FilterSidebarProps = {
  categories: { id: string; name: string; slug: string }[];
};

export function FilterSidebar({ categories }: FilterSidebarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(name, value);
      } else {
        params.delete(name);
      }
      return params.toString();
    },
    [searchParams]
  );

  const handleFilterChange = (name: string, value: string) => {
    router.push(`/shop?${createQueryString(name, value)}`);
  };

  const currentCategory = searchParams.get("category") || "";
  const currentSort = searchParams.get("sort") || "newest";

  const filtersContent = (
    <div className="space-y-8">
      {/* Search Filter */}
      <div>
        <h3 className="font-heading font-black tracking-widest uppercase text-sm text-gray-900 dark:text-white mb-4">Search</h3>
        <input 
          type="text" 
          placeholder="Search products..."
          defaultValue={searchParams.get("q") || ""}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleFilterChange("q", e.currentTarget.value);
          }}
          onBlur={(e) => handleFilterChange("q", e.target.value)}
          className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-brand dark:text-white"
        />
      </div>

      {/* Category Filter */}
      <div>
        <h3 className="font-heading font-black tracking-widest uppercase text-sm text-gray-900 dark:text-white mb-4">Categories</h3>
        <div className="space-y-3">
          <label className="flex items-center gap-3 cursor-pointer group">
            <input 
              type="radio" 
              name="category" 
              checked={currentCategory === ""}
              onChange={() => handleFilterChange("category", "")}
              className="w-4 h-4 text-brand bg-gray-100 border-gray-300 focus:ring-brand focus:ring-2 dark:bg-gray-900 dark:border-gray-800"
            />
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400 group-hover:text-brand transition-colors">All Products</span>
          </label>
          {categories.map((cat) => (
            <label key={cat.id} className="flex items-center gap-3 cursor-pointer group">
              <input 
                type="radio" 
                name="category" 
                checked={currentCategory === cat.slug}
                onChange={() => handleFilterChange("category", cat.slug)}
                className="w-4 h-4 text-brand bg-gray-100 border-gray-300 focus:ring-brand focus:ring-2 dark:bg-gray-900 dark:border-gray-800"
              />
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400 group-hover:text-brand transition-colors">{cat.name}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Size Filter */}
      <div>
        <h3 className="font-heading font-black tracking-widest uppercase text-sm text-gray-900 dark:text-white mb-4">Size</h3>
        <div className="flex flex-wrap gap-2">
          {['S', 'M', 'L', 'XL', 'XXL'].map(size => {
            const currentSizes = searchParams.get("size")?.split(',') || [];
            const isSelected = currentSizes.includes(size);
            return (
              <button 
                key={size}
                onClick={() => {
                  const newSizes = isSelected ? currentSizes.filter(s => s !== size) : [...currentSizes, size];
                  handleFilterChange("size", newSizes.join(','));
                }}
                className={`w-10 h-10 rounded-lg font-bold text-xs flex items-center justify-center border transition-all ${isSelected ? 'border-brand bg-brand text-white' : 'border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400 hover:border-brand hover:text-brand'}`}
              >
                {size}
              </button>
            )
          })}
        </div>
      </div>

      {/* Color Filter */}
      <div>
        <h3 className="font-heading font-black tracking-widest uppercase text-sm text-gray-900 dark:text-white mb-4">Color</h3>
        <div className="flex flex-wrap gap-3">
          {[
            {name: 'Black', hex: '#000000'}, {name: 'White', hex: '#ffffff'}, 
            {name: 'Red', hex: '#ef4444'}, {name: 'Blue', hex: '#3b82f6'}, 
            {name: 'Green', hex: '#22c55e'}, {name: 'Navy', hex: '#1e3a8a'}
          ].map(color => {
            const currentColors = searchParams.get("color")?.split(',') || [];
            const isSelected = currentColors.includes(color.name);
            return (
              <button 
                key={color.name}
                title={color.name}
                onClick={() => {
                  const newColors = isSelected ? currentColors.filter(c => c !== color.name) : [...currentColors, color.name];
                  handleFilterChange("color", newColors.join(','));
                }}
                className={`w-8 h-8 rounded-full border-2 transition-all ${isSelected ? 'border-brand scale-110' : 'border-transparent hover:scale-110 shadow-sm'}`}
                style={{ backgroundColor: color.hex, borderColor: isSelected ? 'var(--brand)' : (color.name === 'White' ? '#e5e7eb' : 'transparent') }}
              />
            )
          })}
        </div>
      </div>

      {/* Sort By */}
      <div>
        <h3 className="font-heading font-black tracking-widest uppercase text-sm text-gray-900 dark:text-white mb-4">Sort By</h3>
        <select 
          value={currentSort}
          onChange={(e) => handleFilterChange("sort", e.target.value)}
          className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-brand dark:text-white"
        >
          <option value="newest">Newest Arrivals</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
          <option value="name_asc">Name: A to Z</option>
        </select>
      </div>

      {/* Price Range */}
      <div>
        <h3 className="font-heading font-black tracking-widest uppercase text-sm text-gray-900 dark:text-white mb-4">Price Range</h3>
        <div className="flex items-center gap-2">
          <input 
            type="number" 
            placeholder="Min"
            defaultValue={searchParams.get("minPrice") || ""}
            onBlur={(e) => handleFilterChange("minPrice", e.target.value)}
            className="w-1/2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl px-4 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-brand dark:text-white"
          />
          <span className="text-gray-500">-</span>
          <input 
            type="number" 
            placeholder="Max"
            defaultValue={searchParams.get("maxPrice") || ""}
            onBlur={(e) => handleFilterChange("maxPrice", e.target.value)}
            className="w-1/2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl px-4 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-brand dark:text-white"
          />
        </div>
      </div>

      {/* Clear Filters */}
      <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
        <button 
          onClick={() => router.push("/shop")}
          className="w-full text-xs font-bold text-gray-500 uppercase tracking-widest hover:text-brand transition-colors"
        >
          Clear All Filters
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Trigger */}
      <button 
        className="md:hidden w-full flex items-center justify-center gap-2 bg-gray-100 dark:bg-gray-900 py-3 rounded-xl font-bold mb-6 text-gray-900 dark:text-white"
        onClick={() => setIsOpen(true)}
      >
        <Filter className="w-5 h-5" /> Filter & Sort
      </button>

      {/* Desktop Sidebar */}
      <div className="hidden md:block w-64 flex-shrink-0">
        <div className="sticky top-32">
          {filtersContent}
        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end md:hidden">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsOpen(false)} />
          <div className="relative w-4/5 max-w-sm bg-white dark:bg-gray-950 h-full overflow-y-auto p-6 shadow-2xl animate-in slide-in-from-right duration-300">
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-heading font-black text-xl tracking-tight text-gray-900 dark:text-white">Filters</h2>
              <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-900 rounded-full text-gray-500">
                <X className="w-6 h-6" />
              </button>
            </div>
            {filtersContent}
          </div>
        </div>
      )}
    </>
  );
}
