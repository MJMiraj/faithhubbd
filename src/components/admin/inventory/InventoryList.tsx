"use client";

import { useState } from "react";
import { StockAdjustmentModal } from "./StockAdjustmentModal";
import { Edit2, AlertTriangle, ArrowUpRight, ArrowDownRight } from "lucide-react";

type InventoryItem = {
  id: string;
  name: string;
  sku: string | null;
  basePrice: number;
  inventory: {
    quantity: number;
    lowStock: number;
    movements: { type: string; quantity: number; createdAt: Date }[];
  } | null;
};

export function InventoryList({ products }: { products: InventoryItem[] }) {
  const [selectedProduct, setSelectedProduct] = useState<InventoryItem | null>(null);

  return (
    <div className="bg-white dark:bg-black rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 text-xs uppercase font-black tracking-widest text-gray-500">
            <tr>
              <th className="px-6 py-4">Product</th>
              <th className="px-6 py-4">SKU</th>
              <th className="px-6 py-4 text-center">Status</th>
              <th className="px-6 py-4 text-right">In Stock</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {products.map((product) => {
              const qty = product.inventory?.quantity || 0;
              const lowStockLevel = product.inventory?.lowStock || 5;
              const isLow = qty <= lowStockLevel;
              const isOut = qty === 0;

              return (
                <tr key={product.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-900/50 transition-colors">
                  <td className="px-6 py-4 font-bold text-gray-900 dark:text-white">
                    {product.name}
                  </td>
                  <td className="px-6 py-4 font-mono text-gray-500">
                    {product.sku || 'N/A'}
                  </td>
                  <td className="px-6 py-4 text-center">
                    {isOut ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">
                        <AlertTriangle className="w-3 h-3" /> Out of Stock
                      </span>
                    ) : isLow ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400">
                        <AlertTriangle className="w-3 h-3" /> Low Stock
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                        In Stock
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right font-black text-lg text-gray-900 dark:text-white">
                    {qty}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => setSelectedProduct(product)}
                      className="inline-flex items-center justify-center p-2 rounded-xl bg-gray-100 hover:bg-brand hover:text-white dark:bg-gray-900 dark:hover:bg-brand text-gray-600 transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {selectedProduct && (
        <StockAdjustmentModal 
          productId={selectedProduct.id}
          productName={selectedProduct.name}
          currentStock={selectedProduct.inventory?.quantity || 0}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </div>
  );
}
