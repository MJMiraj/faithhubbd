"use client";

import { useState } from "react";
import { updateOrderStatus, dispatchOrderAction } from "../actions";
import { Save, CheckCircle, Truck } from "lucide-react";
import { useRouter } from "next/navigation";

export function OrderStatusForm({ orderId, currentStatus, currentPaymentStatus }: { orderId: string, currentStatus: string, currentPaymentStatus: string }) {
  const [status, setStatus] = useState(currentStatus);
  const [paymentStatus, setPaymentStatus] = useState(currentPaymentStatus);
  const [isPending, setIsPending] = useState(false);
  const [isDispatching, setIsDispatching] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [dispatchResult, setDispatchResult] = useState<{ success?: boolean; error?: string; trackingNumber?: string } | null>(null);
  const router = useRouter();

  const handleUpdate = async () => {
    setIsPending(true);
    setShowSuccess(false);
    
    const res = await updateOrderStatus(orderId, status, paymentStatus);
    
    if (res.success) {
      setShowSuccess(true);
      router.refresh();
      setTimeout(() => setShowSuccess(false), 3000);
    }
    setIsPending(false);
  };

  const handleDispatch = async () => {
    setIsDispatching(true);
    setDispatchResult(null);

    const res = await dispatchOrderAction(orderId);
    
    if (res.success) {
      setDispatchResult({ success: true, trackingNumber: res.trackingNumber });
      setStatus("SHIPPED"); // Local state update
      router.refresh();
    } else {
      setDispatchResult({ error: res.error });
    }
    setIsDispatching(false);
  };

  const canDispatch = currentStatus === "PENDING" || currentStatus === "PROCESSING";

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 space-y-6">
      <h3 className="text-xl font-black text-gray-900 border-b border-gray-100 pb-4">Update Fulfillment</h3>
      
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700">Payment Status</label>
          <select 
            value={paymentStatus}
            onChange={(e) => setPaymentStatus(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand focus:outline-none text-gray-900 bg-white font-semibold"
          >
            <option value="UNPAID">🔴 Unpaid</option>
            <option value="PAID">🟢 Paid</option>
            <option value="REFUNDED">⚪ Refunded</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700">Fulfillment Status</label>
          <select 
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand focus:outline-none text-gray-900 bg-white font-semibold"
          >
            <option value="PENDING">🕒 Pending</option>
            <option value="PROCESSING">📦 Processing</option>
            <option value="SHIPPED">🚚 Shipped</option>
            <option value="DELIVERED">✅ Delivered</option>
            <option value="CANCELLED">❌ Cancelled</option>
          </select>
        </div>
      </div>

      <button
        onClick={handleUpdate}
        disabled={isPending || (status === currentStatus && paymentStatus === currentPaymentStatus)}
        className="w-full bg-brand hover:bg-brand-dark text-white px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
      >
        {isPending ? "Updating..." : (showSuccess ? <><CheckCircle className="w-5 h-5"/> Saved!</> : <><Save className="w-5 h-5"/> Save Changes</>)}
      </button>

      {/* Dispatch Section */}
      <div className="pt-6 mt-6 border-t border-gray-100 space-y-4">
        <h4 className="text-sm font-bold text-gray-900">Courier Integration</h4>
        
        {dispatchResult?.success && (
          <div className="bg-green-50 text-green-700 p-4 rounded-xl text-sm font-semibold border border-green-100 flex flex-col gap-1">
            <span className="flex items-center gap-2"><CheckCircle className="w-4 h-4"/> Consignment Created</span>
            <span className="text-green-600">Tracking: {dispatchResult.trackingNumber}</span>
          </div>
        )}
        
        {dispatchResult?.error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-semibold border border-red-100">
            {dispatchResult.error}
          </div>
        )}

        {canDispatch ? (
          <button
            onClick={handleDispatch}
            disabled={isDispatching}
            className="w-full bg-black hover:bg-gray-800 text-white px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
          >
            {isDispatching ? (
               <div className="flex items-center gap-2">
                 <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                 Dispatching...
               </div>
            ) : (
              <><Truck className="w-5 h-5"/> Dispatch to Courier (Auto)</>
            )}
          </button>
        ) : (
          <p className="text-xs font-semibold text-gray-500 bg-gray-50 p-4 rounded-xl text-center">
            {currentStatus === "SHIPPED" || currentStatus === "DELIVERED" 
              ? "Order has already been dispatched." 
              : "Order must be PENDING or PROCESSING to dispatch."}
          </p>
        )}
      </div>
    </div>
  );
}
