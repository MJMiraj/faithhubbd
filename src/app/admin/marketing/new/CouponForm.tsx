"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Save, AlertCircle } from "lucide-react";
import { createCoupon } from "../actions";

export function CouponForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [isPending, setIsPending] = useState(false);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPending(true);
    setError("");

    try {
      const formData = new FormData(e.currentTarget);
      const res = await createCoupon(formData);
      
      if (res.error) throw new Error(res.error);
      
      router.push("/admin/marketing");
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
      setIsPending(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl flex items-center gap-2 border border-red-100">
          <AlertCircle className="w-5 h-5" />
          <p className="font-semibold text-sm">{error}</p>
        </div>
      )}

      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Coupon Code</label>
            <input
              name="code"
              required
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 rounded-xl focus:ring-2 focus:ring-brand focus:outline-none dark:text-white uppercase"
              placeholder="e.g. SUMMER26"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Discount Type</label>
            <select name="discountType" className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 rounded-xl focus:ring-2 focus:ring-brand focus:outline-none dark:text-white">
              <option value="PERCENTAGE">Percentage (%)</option>
              <option value="FIXED">Fixed Amount (৳)</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Discount Value</label>
            <input
              name="discountValue"
              type="number"
              step="0.01"
              required
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 rounded-xl focus:ring-2 focus:ring-brand focus:outline-none dark:text-white"
              placeholder="e.g. 20"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Minimum Purchase Amount (Optional)</label>
            <input
              name="minPurchase"
              type="number"
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 rounded-xl focus:ring-2 focus:ring-brand focus:outline-none dark:text-white"
              placeholder="e.g. 1500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Valid From</label>
            <input
              name="validFrom"
              type="date"
              required
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 rounded-xl focus:ring-2 focus:ring-brand focus:outline-none dark:text-white"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Valid Until</label>
            <input
              name="validUntil"
              type="date"
              required
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 rounded-xl focus:ring-2 focus:ring-brand focus:outline-none dark:text-white"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Usage Limit (Optional)</label>
            <input
              name="usageLimit"
              type="number"
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 rounded-xl focus:ring-2 focus:ring-brand focus:outline-none dark:text-white"
              placeholder="e.g. 100"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Status</label>
            <select name="isActive" className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 rounded-xl focus:ring-2 focus:ring-brand focus:outline-none dark:text-white">
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      <div className="pt-6 flex justify-end">
        <button 
          type="submit"
          disabled={isPending}
          className="bg-brand hover:bg-brand-dark text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 transition-all disabled:opacity-50 shadow-lg shadow-brand/20 hover:-translate-y-0.5 active:translate-y-0"
        >
          {isPending ? "Saving..." : <><Save className="w-5 h-5" /> Save Coupon</>}
        </button>
      </div>
    </form>
  );
}
