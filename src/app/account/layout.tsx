import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { User, Heart, ShoppingBag, Settings, LogOut } from "lucide-react";

export default async function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-gray-950 pt-32 pb-24 w-full transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-heading font-black tracking-tighter text-gray-900 dark:text-white">My Account</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">Manage your orders, wishlist, and profile.</p>
        </div>

        <div className="flex flex-col md:flex-row gap-12">
          {/* Sidebar */}
          <aside className="w-full md:w-64 shrink-0">
            <nav className="flex flex-col gap-2">
              <Link href="/account" className="flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow-sm border border-gray-100 dark:border-gray-800">
                <User className="w-5 h-5" /> Profile
              </Link>
              <Link href="/account/orders" className="flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm text-gray-500 hover:bg-white dark:hover:bg-gray-900 hover:text-gray-900 dark:hover:text-white transition-all">
                <ShoppingBag className="w-5 h-5" /> Order History
              </Link>
              <Link href="/account/wishlist" className="flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm text-gray-500 hover:bg-white dark:hover:bg-gray-900 hover:text-gray-900 dark:hover:text-white transition-all">
                <Heart className="w-5 h-5" /> Wishlist
              </Link>
              <Link href="/account/settings" className="flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm text-gray-500 hover:bg-white dark:hover:bg-gray-900 hover:text-gray-900 dark:hover:text-white transition-all">
                <Settings className="w-5 h-5" /> Settings
              </Link>
            </nav>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
