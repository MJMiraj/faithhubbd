import { InfoPage } from "@/components/layout/InfoPage";
import { Package, Search, MapPin, CheckCircle, Truck, Phone, ArrowRight } from "lucide-react";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";

export default async function TrackOrderPage({ searchParams }: { searchParams: { order_id?: string, phone?: string } }) {
  const { order_id, phone } = await searchParams;
  let orderData = null;
  let error = null;

  if (order_id && phone) {
    const order = await db.order.findFirst({
      where: { 
        orderNumber: order_id,
        user: { phone: phone }
      },
      include: {
        items: { include: { product: true } },
        shipment: { include: { tracking: { orderBy: { timestamp: 'desc' } } } }
      }
    });

    if (order) {
      orderData = order;
    } else {
      error = "Order not found. Please check your Order ID and Phone Number.";
    }
  }

  return (
    <div className="min-h-[70vh] bg-gray-50/50 dark:bg-gray-950 pt-32 pb-24">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-brand/10 text-brand rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Package className="w-8 h-8" />
          </div>
          <h1 className="text-4xl font-black text-gray-900 dark:text-white mb-4">Track Your Order</h1>
          <p className="text-gray-500 dark:text-gray-400">Enter your order details to see the latest shipping updates.</p>
        </div>

        <form className="bg-white dark:bg-gray-900 p-8 rounded-[2rem] shadow-sm border border-gray-100 dark:border-gray-800 mb-8" action="/track">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Order ID</label>
              <input 
                type="text" 
                name="order_id" 
                defaultValue={order_id || ""}
                placeholder="e.g., FH-123456" 
                required
                className="w-full bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Phone Number</label>
              <input 
                type="text" 
                name="phone"
                defaultValue={phone || ""} 
                placeholder="01XXXXXXXXX" 
                required
                className="w-full bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand"
              />
            </div>
          </div>
          <button 
            type="submit"
            className="w-full bg-brand text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-brand-dark transition-colors"
          >
            <Search className="w-5 h-5" /> Track Now
          </button>
        </form>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 text-red-500 p-4 rounded-xl text-center font-medium">
            {error}
          </div>
        )}

        {orderData && (
          <div className="bg-white dark:bg-gray-900 rounded-[2rem] shadow-sm border border-gray-100 dark:border-gray-800 p-8 animate-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-gray-100 dark:border-gray-800 pb-6 mb-6">
              <div>
                <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-1">Order #{orderData.orderNumber}</h2>
                <p className="text-sm font-bold text-gray-500">Status: <span className="text-brand uppercase">{orderData.status}</span></p>
              </div>
              <div className="mt-4 md:mt-0 text-left md:text-right">
                <p className="text-sm text-gray-500">Total Amount</p>
                <p className="text-xl font-black text-gray-900 dark:text-white">৳ {orderData.totalAmount}</p>
              </div>
            </div>

            {/* Tracking Timeline */}
            <div className="relative pl-8 space-y-8 before:absolute before:inset-0 before:ml-4 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-200 dark:before:via-gray-800 before:to-transparent">
              
              <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                <div className="flex items-center justify-center w-8 h-8 rounded-full border-4 border-white dark:border-gray-900 bg-brand text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                  <CheckCircle className="w-4 h-4" />
                </div>
                <div className="w-[calc(100%-3rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 shadow-sm">
                  <div className="flex items-center justify-between space-x-2 mb-1">
                    <div className="font-bold text-gray-900 dark:text-white">Order Placed</div>
                    <time className="font-medium text-xs text-gray-500">{new Date(orderData.createdAt).toLocaleDateString()}</time>
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">We received your order.</div>
                </div>
              </div>

              {orderData.shipment?.tracking.map((t: any, i: number) => (
                <div key={t.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full border-4 border-white dark:border-gray-900 bg-brand text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                    <Truck className="w-4 h-4" />
                  </div>
                  <div className="w-[calc(100%-3rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 shadow-sm">
                    <div className="flex items-center justify-between space-x-2 mb-1">
                      <div className="font-bold text-gray-900 dark:text-white">{t.status}</div>
                      <time className="font-medium text-xs text-gray-500">{new Date(t.timestamp).toLocaleDateString()}</time>
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">{t.location || 'Steadfast Courier Hub'}</div>
                  </div>
                </div>
              ))}
            </div>

            {orderData.shipment?.trackingNumber && (
              <div className="mt-8 p-6 bg-brand/5 rounded-2xl text-center">
                <p className="text-sm font-bold text-gray-600 dark:text-gray-400 mb-2">Steadfast Tracking Consignment</p>
                <p className="text-2xl font-black text-brand tracking-widest">{orderData.shipment.trackingNumber}</p>
                <a 
                  href={`https://steadfast.com.bd/t/${orderData.shipment.trackingNumber}`} 
                  target="_blank" 
                  rel="noreferrer"
                  className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-brand hover:underline"
                >
                  View on Steadfast Website <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
