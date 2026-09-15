"use client";

import { useState } from "react";
import { X, PackagePlus, PackageMinus } from "lucide-react";
import { adjustInventory } from "@/app/admin/inventory/actions";

type Props = {
  productId: string;
  productName: string;
  currentStock: number;
  onClose: () => void;
};

export function StockAdjustmentModal({ productId, productName, currentStock, onClose }: Props) {
  const [change, setChange] = useState<number>(0);
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (change === 0) return;
    
    setLoading(true);
    await adjustInventory(productId, change, reason || "Manual adjustment");
    setLoading(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white dark:bg-gray-950 rounded-3xl w-full max-w-md p-8 shadow-2xl border border-gray-100 dark:border-gray-800 animate-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Adjust Stock</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-900 rounded-full">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
          Product: <strong className="text-gray-900 dark:text-white">{productName}</strong><br/>
          Current Stock: <strong className="text-brand">{currentStock}</strong>
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-2 block">Quantity Change</label>
            <div className="flex items-center gap-4">
              <button 
                type="button" 
                onClick={() => setChange(c => c - 1)}
                className="p-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-100"
              >
                <PackageMinus className="w-5 h-5" />
              </button>
              <input
                type="number"
                value={change}
                onChange={(e) => setChange(parseInt(e.target.value) || 0)}
                className="w-full text-center text-2xl font-black bg-gray-50 dark:bg-gray-900 border-0 rounded-xl py-2 focus:ring-2 focus:ring-brand dark:text-white"
              />
              <button 
                type="button" 
                onClick={() => setChange(c => c + 1)}
                className="p-3 bg-green-50 text-green-600 rounded-xl hover:bg-green-100"
              >
                <PackagePlus className="w-5 h-5" />
              </button>
            </div>
            <p className="text-center text-sm font-medium mt-2 text-gray-500">
              New Stock: {Math.max(0, currentStock + change)}
            </p>
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-2 block">Reason (Optional)</label>
            <input
              type="text"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. Restock, Damaged, Return"
              className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-brand focus:outline-none dark:text-white"
            />
          </div>

          <button 
            type="submit" 
            disabled={loading || change === 0}
            className="w-full bg-brand text-white font-bold rounded-xl py-3 shadow-lg shadow-brand/20 disabled:opacity-50 transition-opacity"
          >
            {loading ? "Saving..." : "Confirm Adjustment"}
          </button>
        </form>
      </div>
    </div>
  );
}
