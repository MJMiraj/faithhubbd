"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  Settings, 
  LogOut,
  Tags,
  BarChart3,
  MessageSquare,
  LayoutTemplate,
  PackageSearch,
  Tag,
  MonitorPlay
} from "lucide-react";
import { signOut } from "next-auth/react";

const menuItems = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Analytics", href: "/admin/analytics", icon: BarChart3 },
  { name: "Products", href: "/admin/products", icon: PackageSearch },
  { name: "Inventory", href: "/admin/inventory", icon: Package },
  { name: "Orders", href: "/admin/orders", icon: ShoppingCart },
  { name: "Customers", href: "/admin/customers", icon: Users },
  { name: "Reviews", href: "/admin/reviews", icon: MessageSquare },
  { name: "Marketing", href: "/admin/marketing", icon: Tag },
  { name: "Store CMS", href: "/admin/cms", icon: MonitorPlay },
  { name: "Settings", href: "/admin/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="w-64 bg-white dark:bg-black border-r border-gray-100 dark:border-gray-900 flex flex-col shrink-0">
      <div className="h-16 flex items-center px-8 border-b border-gray-100 dark:border-gray-900 shrink-0">
        <Link href="/" className="font-heading font-black text-xl tracking-tighter text-gray-900 dark:text-white hover:opacity-70 transition-opacity">
          FAITHHUB<span className="opacity-50">BD</span>
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto py-6 px-4 flex flex-col gap-1 custom-scrollbar">
        {menuItems.map((item) => {
          const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`);
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all group ${
                isActive 
                  ? "bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white" 
                  : "text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-900/50 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              <Icon className={`w-4 h-4 transition-transform ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} />
              {item.name}
            </Link>
          );
        })}
      </div>

      <div className="p-4 border-t border-gray-100 dark:border-gray-900 shrink-0">
        <button 
          onClick={() => signOut({ callbackUrl: '/login' })}
          className="flex items-center gap-3 px-4 py-3 w-full rounded-xl font-bold text-sm text-gray-500 hover:bg-red-50 dark:hover:bg-red-900/10 hover:text-red-600 transition-colors group"
        >
          <LogOut className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Sign Out
        </button>
      </div>
    </div>
  );
}
