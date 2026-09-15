import { InfoPage } from "@/components/layout/InfoPage";
import Link from "next/link";
import { ArrowRight, Zap } from "lucide-react";

export default function SalePage() {
  return (
    <InfoPage 
      title="Flash Sale" 
      description="Exclusive discounts on premium collections. Limited time offers."
      content={
        <div className="space-y-8 mt-12 text-center flex flex-col items-center">
          <div className="inline-flex items-center justify-center p-6 bg-black text-white dark:bg-white dark:text-black rounded-full mb-6">
            <Zap className="w-12 h-12" />
          </div>
          
          <h2 className="text-4xl md:text-5xl font-heading font-black tracking-tighter text-gray-900 dark:text-white mb-6">
            The Winter Drop is Coming.
          </h2>
          
          <p className="text-xl text-gray-500 max-w-2xl mx-auto mb-12">
            Our next major sale event begins in 14 days. Up to 50% off on all premium tees, polos, and exclusive winter wear. 
          </p>

          <Link href="/shop" className="inline-flex items-center gap-3 bg-brand hover:bg-brand-dark text-white px-8 py-4 rounded-full font-bold text-lg transition-transform hover:scale-105 shadow-xl shadow-brand/20">
            Shop Regular Collection <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      }
    />
  );
}
