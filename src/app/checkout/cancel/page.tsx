import Link from "next/link";
import { AlertTriangle, RefreshCcw } from "lucide-react";

export default function CheckoutCancelPage({ searchParams }: { searchParams: { order_id?: string } }) {
  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-gray-50/50 p-4">
      <div className="max-w-md w-full bg-white rounded-[2rem] shadow-xl p-10 text-center animate-in fade-in slide-in-from-bottom-8 duration-700">
        <div className="w-24 h-24 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-8">
          <AlertTriangle className="w-12 h-12" />
        </div>
        
        <h1 className="text-3xl font-black text-gray-900 mb-4">Payment Canceled</h1>
        <p className="text-gray-500 font-medium mb-8">
          Your payment was canceled or failed. You have not been charged.
        </p>

        <div className="space-y-4">
          <Link 
            href="/checkout"
            className="w-full bg-brand hover:bg-brand-dark text-white px-8 py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors"
          >
            <RefreshCcw className="w-5 h-5" />
            Try Again
          </Link>
          <Link 
            href="/shop"
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-900 px-8 py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors"
          >
            Return to Shop
          </Link>
        </div>
      </div>
    </div>
  );
}
