import { db } from "@/lib/db";
import Link from "next/link";
import { Eye, Clock, CheckCircle, Truck, Package, XCircle } from "lucide-react";

export default async function AdminOrdersPage() {
  const orders = await db.order.findMany({
    include: {
      user: true,
      items: true
    },
    orderBy: { createdAt: 'desc' }
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-bold flex items-center gap-1 w-fit"><Clock className="w-3 h-3"/> Pending</span>;
      case 'PROCESSING':
        return <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold flex items-center gap-1 w-fit"><Package className="w-3 h-3"/> Processing</span>;
      case 'SHIPPED':
        return <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-bold flex items-center gap-1 w-fit"><Truck className="w-3 h-3"/> Shipped</span>;
      case 'DELIVERED':
        return <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold flex items-center gap-1 w-fit"><CheckCircle className="w-3 h-3"/> Delivered</span>;
      case 'CANCELLED':
        return <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold flex items-center gap-1 w-fit"><XCircle className="w-3 h-3"/> Cancelled</span>;
      default:
        return <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-bold w-fit">{status}</span>;
    }
  };

  const getPaymentBadge = (status: string) => {
    switch (status) {
      case 'PAID':
        return <span className="px-3 py-1 bg-emerald-50 text-emerald-600 border border-emerald-200 rounded-full text-xs font-bold">Paid</span>;
      case 'UNPAID':
        return <span className="px-3 py-1 bg-rose-50 text-rose-600 border border-rose-200 rounded-full text-xs font-bold">Unpaid</span>;
      case 'REFUNDED':
        return <span className="px-3 py-1 bg-gray-50 text-gray-600 border border-gray-200 rounded-full text-xs font-bold">Refunded</span>;
      default:
        return <span className="px-3 py-1 bg-gray-50 text-gray-600 border border-gray-200 rounded-full text-xs font-bold">{status}</span>;
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl md:text-4xl font-heading font-black text-gray-900 dark:text-white tracking-tight">Orders</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2 font-medium">Track and fulfill customer orders.</p>
        </div>
      </div>

      <div className="bg-white dark:bg-black rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-100 dark:border-gray-800">
                <th className="px-6 py-5 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">Order ID</th>
                <th className="px-6 py-5 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">Customer</th>
                <th className="px-6 py-5 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">Date</th>
                <th className="px-6 py-5 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">Amount</th>
                <th className="px-6 py-5 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">Payment</th>
                <th className="px-6 py-5 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">Status</th>
                <th className="px-6 py-5 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                    No orders found.
                  </td>
                </tr>
              ) : null}
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors group">
                  <td className="px-6 py-5">
                    <span className="font-mono font-bold text-brand bg-brand/5 px-2 py-1 rounded-md">#{order.orderNumber}</span>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white flex items-center justify-center font-bold text-sm">
                        {order.user.firstName?.charAt(0) || order.user.email.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-bold text-gray-900 dark:text-white">{order.user.firstName} {order.user.lastName}</p>
                        <p className="text-xs font-medium text-gray-500 dark:text-gray-400">{order.user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-sm text-gray-500 dark:text-gray-400 font-medium">
                    {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </td>
                  <td className="px-6 py-5 font-bold text-gray-900 dark:text-white">৳ {order.totalAmount}</td>
                  <td className="px-6 py-5">{getPaymentBadge(order.paymentStatus)}</td>
                  <td className="px-6 py-5">{getStatusBadge(order.status)}</td>
                  <td className="px-6 py-5 text-right">
                    <Link href={`/admin/orders/${order.id}`} className="p-2 text-gray-400 hover:text-brand hover:bg-brand/10 rounded-xl transition-colors inline-flex opacity-0 group-hover:opacity-100 focus:opacity-100">
                      <Eye className="w-5 h-5" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
