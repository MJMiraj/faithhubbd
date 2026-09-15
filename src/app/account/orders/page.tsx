import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { ShoppingBag } from "lucide-react";
import Link from "next/link";

export default async function OrdersPage() {
  const session = await getServerSession(authOptions);
  
  const user = await db.user.findUnique({
    where: { email: session?.user?.email || "" }
  });

  if (!user) return null;

  const orders = await db.order.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: 'desc' },
    include: {
      items: {
        include: {
          product: true
        }
      }
    }
  });

  return (
    <div className="bg-white dark:bg-black rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-6">Order History</h2>
      
      {orders.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 dark:bg-gray-900/50 rounded-2xl border border-gray-100 dark:border-gray-800 flex flex-col items-center">
          <div className="w-16 h-16 bg-brand/10 text-brand rounded-full flex items-center justify-center mb-4">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <p className="text-gray-500 dark:text-gray-400 font-medium mb-6">You haven't placed any orders yet.</p>
          <Link href="/shop" className="bg-black dark:bg-white text-white dark:text-black px-6 py-3 rounded-full font-bold text-sm tracking-widest uppercase hover:scale-105 transition-transform">
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.id} className="border border-gray-100 dark:border-gray-800 rounded-2xl p-6 bg-gray-50 dark:bg-gray-900/50">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4 border-b border-gray-200 dark:border-gray-800 pb-6">
                <div>
                  <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">Order ID</p>
                  <p className="font-mono font-medium text-gray-900 dark:text-white">{order.id}</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">Date</p>
                  <p className="font-medium text-gray-900 dark:text-white">{new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">Status</p>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold mt-1 ${
                    order.status === 'DELIVERED' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 
                    order.status === 'CANCELLED' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                    'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                  }`}>
                    {order.status}
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">Total</p>
                  <p className="font-black text-xl text-brand">৳{order.totalAmount}</p>
                </div>
              </div>
              
              <div className="space-y-4">
                {order.items.map((item) => (
                  <div key={item.id} className="flex justify-between items-center">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-white dark:bg-black rounded-lg border border-gray-200 dark:border-gray-800 flex items-center justify-center shrink-0 overflow-hidden">
                         <span className="text-xs font-bold text-gray-400">Img</span>
                      </div>
                      <div>
                        <p className="font-bold text-gray-900 dark:text-white line-clamp-1">{item.product.name}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Qty: {item.quantity} × ৳{item.price}</p>
                      </div>
                    </div>
                    <div className="font-bold text-gray-900 dark:text-white">
                      ৳{item.quantity * item.price}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
