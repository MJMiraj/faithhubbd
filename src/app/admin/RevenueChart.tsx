"use client";

import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export function RevenueChart({ data }: { data: any[] }) {
  if (!data || data.length === 0) {
    return (
      <div className="h-full flex items-center justify-center text-gray-400">
        No data available
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#000000" stopOpacity={0.8}/>
            <stop offset="95%" stopColor="#000000" stopOpacity={0}/>
          </linearGradient>
          <linearGradient id="colorRevenueDark" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#ffffff" stopOpacity={0.8}/>
            <stop offset="95%" stopColor="#ffffff" stopOpacity={0}/>
          </linearGradient>
        </defs>
        <XAxis 
          dataKey="date" 
          axisLine={false} 
          tickLine={false} 
          tick={{ fontSize: 12, fill: '#888' }}
          dy={10}
        />
        <YAxis 
          axisLine={false} 
          tickLine={false} 
          tick={{ fontSize: 12, fill: '#888' }}
          tickFormatter={(value) => `৳${value}`}
        />
        <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#eee" className="dark:stroke-gray-800" />
        <Tooltip 
          contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
          formatter={(value: any) => [`৳${value}`, 'Revenue']}
        />
        <Area 
          type="monotone" 
          dataKey="revenue" 
          stroke="currentColor" 
          fillOpacity={1} 
          fill="url(#colorRevenue)" 
          className="text-black dark:text-white dark:fill-[url(#colorRevenueDark)]"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
