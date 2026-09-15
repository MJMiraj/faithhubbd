import { db } from "@/lib/db";
import { Users, Mail, Phone, Calendar } from "lucide-react";

export default async function AdminCustomersPage() {
  const users = await db.user.findMany({
    include: {
      orders: true
    },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl md:text-4xl font-heading font-black text-gray-900 dark:text-white tracking-tight">Customers</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2 font-medium">Manage your registered users and customer base.</p>
        </div>
      </div>

      <div className="bg-white dark:bg-black rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-100 dark:border-gray-800">
                <th className="px-6 py-5 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">Customer</th>
                <th className="px-6 py-5 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">Contact</th>
                <th className="px-6 py-5 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">Role</th>
                <th className="px-6 py-5 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">Total Orders</th>
                <th className="px-6 py-5 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors group">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white flex items-center justify-center font-black">
                        {user.firstName?.charAt(0).toUpperCase() || user.email.charAt(0).toUpperCase()}
                      </div>
                      <p className="font-bold text-gray-900 dark:text-white">{user.firstName} {user.lastName}</p>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="space-y-1">
                      <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 flex items-center gap-2"><Mail className="w-3 h-3"/> {user.email}</p>
                      {user.phone && <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 flex items-center gap-2"><Phone className="w-3 h-3"/> {user.phone}</p>}
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      user.roleId === 'admin' ? 'bg-purple-100 text-purple-700 dark:bg-purple-500/10 dark:text-purple-400' : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
                    }`}>
                      {user.roleId === 'admin' ? 'Admin' : 'Customer'}
                    </span>
                  </td>
                  <td className="px-6 py-5 font-bold text-gray-900 dark:text-white">
                    {user.orders.length}
                  </td>
                  <td className="px-6 py-5 text-sm font-semibold text-gray-500 dark:text-gray-400 flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    {new Date(user.createdAt).toLocaleDateString()}
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
