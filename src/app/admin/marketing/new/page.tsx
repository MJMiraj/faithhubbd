import { CouponForm } from "./CouponForm";

export default function NewCouponPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl md:text-4xl font-heading font-black text-gray-900 dark:text-white tracking-tight">Create Coupon</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2 font-medium">Generate a new discount code for your customers.</p>
      </div>

      <div className="bg-white dark:bg-black rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm p-8">
        <CouponForm />
      </div>
    </div>
  );
}
