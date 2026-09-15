import { db } from "@/lib/db";
import { Plus, Tags, Trash2 } from "lucide-react";
import Link from "next/link";
import { deleteCoupon } from "./actions";

export default async function MarketingPage() {
  const coupons = await db.coupon.findMany({
    orderBy: { validUntil: 'desc' }
  });

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl md:text-4xl font-heading font-black text-gray-900 dark:text-white tracking-tight">Marketing Center</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2 font-medium">Manage coupons, discounts, and promotional campaigns.</p>
        </div>
        <Link href="/admin/marketing/new" className="bg-brand text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-brand-dark transition-transform hover:scale-105 active:scale-95 shadow-lg shadow-brand/20">
          <Plus className="w-5 h-5" /> Create Coupon
        </Link>
      </div>

      <div className="bg-white dark:bg-black rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden p-8">
        <h2 className="text-xl font-black text-gray-900 dark:text-white flex items-center gap-2 mb-6">
          <Tags className="w-6 h-6 text-brand" /> Active Coupons
        </h2>
        
        {coupons.length === 0 ? (
           <div className="text-center py-12 bg-gray-50 dark:bg-gray-900/50 rounded-2xl border border-gray-100 dark:border-gray-800">
            <p className="text-gray-500 dark:text-gray-400 font-medium">No coupons found. Create your first campaign!</p>
           </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {coupons.map((coupon) => (
              <div key={coupon.id} className="group relative rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden bg-gray-50 dark:bg-gray-900 hover:border-brand transition-colors p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="inline-block bg-brand/10 text-brand px-3 py-1 rounded-full text-sm font-black tracking-widest border border-brand/20">
                    {coupon.code}
                  </div>
                  <form action={async () => {
                    "use server";
                    await deleteCoupon(coupon.id);
                  }}>
                    <button type="submit" className="text-gray-400 hover:text-red-500 transition-colors">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </form>
                </div>
                
                <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-1">
                  {coupon.discountType === 'PERCENTAGE' ? `${coupon.discountValue}% OFF` : `৳${coupon.discountValue} OFF`}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                  Valid until {new Date(coupon.validUntil).toLocaleDateString()}
                </p>

                <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-800">
                  <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Used: {coupon.usedCount} {coupon.usageLimit ? `/ ${coupon.usageLimit}` : ''}
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-bold ${coupon.isActive ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>
                    {coupon.isActive ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
