import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export default async function AccountPage() {
  const session = await getServerSession(authOptions);
  
  const user = await db.user.findUnique({
    where: { email: session?.user?.email || "" },
    include: {
      orders: {
        orderBy: { createdAt: 'desc' },
        include: { items: true, shipment: true }
      }
    }
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div className="bg-white dark:bg-black rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm p-8 animate-in fade-in slide-in-from-bottom-4 duration-500 md:col-span-1 h-fit">
        <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-6">Profile Information</h2>
        
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">First Name</label>
              <p className="font-medium text-gray-900 dark:text-white">{user?.firstName || "N/A"}</p>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Last Name</label>
              <p className="font-medium text-gray-900 dark:text-white">{user?.lastName || "N/A"}</p>
            </div>
          </div>

          <div className="p-4 bg-brand/10 rounded-2xl border border-brand/20">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-brand text-white rounded-xl flex items-center justify-center font-bold text-xl">
                ★
              </div>
              <div>
                <p className="text-xs font-bold text-brand uppercase tracking-wider">Loyalty Points</p>
                <p className="text-2xl font-black text-gray-900 dark:text-white">{user?.loyaltyPoints || 0} PTS</p>
              </div>
            </div>
          </div>
          
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Email</label>
            <p className="font-medium text-gray-900 dark:text-white truncate">{user?.email}</p>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Member Since</label>
            <p className="font-medium text-gray-900 dark:text-white">{new Date(user?.createdAt || Date.now()).toLocaleDateString()}</p>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-black rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm p-8 animate-in fade-in slide-in-from-bottom-4 duration-500 md:col-span-2 delay-100">
        <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-6">Order History</h2>
        
        {(!user?.orders || user.orders.length === 0) ? (
          <div className="text-center py-12 bg-gray-50 dark:bg-gray-900/50 rounded-2xl border border-dashed border-gray-200 dark:border-gray-800">
            <p className="text-gray-500 font-medium">You haven't placed any orders yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {user.orders.map((order) => (
              <div key={order.id} className="border border-gray-100 dark:border-gray-800 rounded-2xl p-6 hover:shadow-md transition-shadow">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 pb-4 border-b border-gray-100 dark:border-gray-800">
                  <div>
                    <h3 className="font-bold text-lg text-gray-900 dark:text-white">#{order.orderNumber}</h3>
                    <p className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="flex gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      order.status === 'DELIVERED' ? 'bg-green-100 text-green-700' :
                      order.status === 'CANCELLED' ? 'bg-red-100 text-red-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>
                      {order.status}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      order.paymentStatus === 'PAID' ? 'bg-green-100 text-green-700' :
                      order.paymentStatus === 'FAILED' ? 'bg-red-100 text-red-700' :
                      'bg-orange-100 text-orange-700'
                    }`}>
                      {order.paymentStatus}
                    </span>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-300">
                        {item.quantity}x Product ID: {item.productId.slice(0, 8)}...
                        {item.variant && <span className="text-gray-400 ml-2">({item.variant})</span>}
                      </span>
                      <span className="font-medium font-mono text-gray-900 dark:text-white">৳{item.price}</span>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-gray-50 dark:border-gray-800/50">
                  <div className="text-sm">
                    {order.shipment?.trackingNumber && (
                      <p className="text-gray-500">
                        Tracking: <span className="font-mono font-bold text-brand">{order.shipment.trackingNumber}</span>
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Total Amount</p>
                    <p className="text-xl font-black text-brand font-mono">৳{order.totalAmount}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
