import { db } from "@/lib/db";
import { BarChart3, TrendingUp, Users, ShoppingCart, DollarSign } from "lucide-react";
import { RoleGate } from "@/components/admin/RoleGate";

export default async function AnalyticsPage() {
  // Fetch some aggregate data
  const totalOrders = await db.order.count();
  const totalCustomers = await db.user.count({ where: { role: { name: 'Customer' } } });
  
  // Aggregate revenue (naive calculation for MVP)
  const orders = await db.order.findMany({
    where: { status: { not: 'CANCELLED' } },
    select: { totalAmount: true, createdAt: true }
  });
  
  const totalRevenue = orders.reduce((acc, order) => acc + order.totalAmount, 0);

  // Calculate monthly data for a simple chart
  const currentMonth = new Date().getMonth();
  const monthlyData = [0, 0, 0, 0, 0, 0]; // Last 6 months
  const monthLabels: string[] = [];

  for (let i = 5; i >= 0; i--) {
    const d = new Date();
    d.setMonth(currentMonth - i);
    monthLabels.push(d.toLocaleString('default', { month: 'short' }));
  }

  orders.forEach(order => {
    const orderMonth = new Date(order.createdAt).getMonth();
    const diff = currentMonth - orderMonth;
    if (diff >= 0 && diff < 6) {
      monthlyData[5 - diff] += order.totalAmount;
    }
  });

  const maxRevenue = Math.max(...monthlyData, 1); // Avoid division by zero

  return (
    <RoleGate 
      allowedRoles={["Super Admin", "Admin"]} 
      fallback={
        <div className="p-8 text-center text-red-500 font-bold bg-red-50 dark:bg-red-950/20 rounded-3xl mt-8 animate-in fade-in zoom-in-95">
          You do not have permission to view store analytics.
        </div>
      }
    >
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-3xl md:text-4xl font-heading font-black text-gray-900 dark:text-white tracking-tight">Analytics Dashboard</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2 font-medium">Real-time insights and metrics on store performance.</p>
          </div>
        </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-black rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm p-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400 rounded-full flex items-center justify-center">
              <DollarSign className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest text-sm">Total Revenue</h3>
          </div>
          <p className="text-4xl font-black text-gray-900 dark:text-white tracking-tight">৳{totalRevenue.toLocaleString()}</p>
        </div>

        <div className="bg-white dark:bg-black rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm p-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 rounded-full flex items-center justify-center">
              <ShoppingCart className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest text-sm">Total Orders</h3>
          </div>
          <p className="text-4xl font-black text-gray-900 dark:text-white tracking-tight">{totalOrders}</p>
        </div>

        <div className="bg-white dark:bg-black rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm p-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400 rounded-full flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest text-sm">Total Customers</h3>
          </div>
          <p className="text-4xl font-black text-gray-900 dark:text-white tracking-tight">{totalCustomers}</p>
        </div>
      </div>

      {/* Revenue Chart */}
      <div className="bg-white dark:bg-black rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm p-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl font-black text-gray-900 dark:text-white flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-brand" /> Revenue Over Time (Last 6 Months)
          </h2>
        </div>

        <div className="h-64 flex items-end gap-2 md:gap-4 relative pt-6 border-b border-gray-100 dark:border-gray-800 pb-2">
          {/* Y-axis lines */}
          <div className="absolute inset-0 flex flex-col justify-between pb-8 pointer-events-none opacity-50">
            <div className="border-t border-dashed border-gray-200 dark:border-gray-800 w-full"></div>
            <div className="border-t border-dashed border-gray-200 dark:border-gray-800 w-full"></div>
            <div className="border-t border-dashed border-gray-200 dark:border-gray-800 w-full"></div>
            <div className="border-t border-dashed border-gray-200 dark:border-gray-800 w-full"></div>
          </div>

          {monthlyData.map((val, idx) => {
            const heightPercent = (val / maxRevenue) * 100;
            return (
              <div key={idx} className="flex-1 flex flex-col items-center gap-2 relative z-10 group">
                {/* Tooltip */}
                <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity bg-black text-white text-xs font-bold px-2 py-1 rounded shadow-lg whitespace-nowrap">
                  ৳{val.toLocaleString()}
                </div>
                {/* Bar */}
                <div className="w-full bg-brand/10 hover:bg-brand/30 dark:bg-brand/20 dark:hover:bg-brand/40 rounded-t-lg relative flex items-end justify-center transition-all duration-500 overflow-hidden" style={{ height: `${Math.max(heightPercent, 2)}%` }}>
                  <div className="w-full bg-brand/50 dark:bg-brand rounded-t-lg transition-all duration-1000 animate-in slide-in-from-bottom-full" style={{ height: '100%' }}></div>
                </div>
                {/* Label */}
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{monthLabels[idx]}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
    </RoleGate>
  );
}
