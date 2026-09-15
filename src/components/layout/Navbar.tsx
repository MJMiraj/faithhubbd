"use client";

import Link from "next/link";
import { Search, ShoppingBag, User, Menu } from "lucide-react";
import { useCartStore } from "@/store/cartStore";

import { useState, useEffect } from "react";
import { useSettingsStore } from "@/store/settingsStore";
import { useTheme } from "next-themes";
import { Moon, Sun, Globe, X } from "lucide-react";
import { useSession } from "next-auth/react";

export function Navbar({ 
  freeShippingThreshold = 1500,
  megaMenuFeatures = []
}: { 
  freeShippingThreshold?: number | null,
  megaMenuFeatures?: { id: string, name: string, imageUrl: string }[]
}) {
  const [mounted, setMounted] = useState(false);
  const cartItems = useCartStore((state) => state.items);
  const cartItemCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const { language, setLanguage } = useSettingsStore();
  const { theme, setTheme } = useTheme();
  const { data: session } = useSession();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
    <header className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur-md border-b border-gray-100 dark:bg-black/90 dark:border-gray-900 transition-colors">
      {/* Top Banner */}
      {(freeShippingThreshold !== null && freeShippingThreshold > 0) && (
        <div className="bg-black text-white dark:bg-white dark:text-black text-xs font-bold tracking-widest text-center py-2.5 uppercase transition-colors">
          Free Delivery on orders over ৳{freeShippingThreshold}
        </div>
      )}
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Mobile Menu & Search (Left) */}
          <div className="flex items-center gap-4 md:hidden">
            <button 
              className="text-gray-900 dark:text-white p-2 -ml-2"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu className="w-6 h-6" />
            </button>
            <Link href="/shop" className="text-gray-900 dark:text-white p-2">
              <Search className="w-5 h-5" />
            </Link>
          </div>

          {/* Logo (Center on mobile, Left on desktop) */}
          <div className="flex-shrink-0 flex items-center justify-center flex-1 md:flex-none md:justify-start">
            <Link href="/" className="flex flex-col items-center md:items-start group">
              <span className="font-heading font-black text-2xl tracking-tighter text-gray-900 dark:text-white group-hover:opacity-70 transition-opacity">
                FAITHHUB<span className="opacity-50">BD</span>
              </span>
            </Link>
          </div>

          {/* Desktop Navigation (Center) - MEGA MENU */}
          <nav className="hidden md:flex space-x-10 h-full">
            {/* New Arrivals - Mega Menu */}
            <div className="group h-full flex items-center">
              <Link href="/category/new" className="text-xs font-bold tracking-widest uppercase text-gray-900 dark:text-white hover:opacity-50 transition-opacity py-8 h-full flex items-center">
                New Arrivals
              </Link>
              <div className="absolute top-full left-0 w-full bg-white dark:bg-black border-b border-gray-100 dark:border-gray-900 shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 z-50">
                <div className="max-w-7xl mx-auto px-8 py-10 grid grid-cols-4 gap-8">
                  <div className="col-span-1">
                    <h3 className="font-bold text-gray-900 dark:text-white mb-4 uppercase tracking-widest text-sm">Featured</h3>
                    <ul className="space-y-3">
                      <li><Link href="/shop?filter=latest" className="text-gray-500 hover:text-black dark:hover:text-white transition-colors text-sm">Latest Drops</Link></li>
                      <li><Link href="/shop?filter=trending" className="text-gray-500 hover:text-black dark:hover:text-white transition-colors text-sm">Trending Now</Link></li>
                      <li><Link href="/shop?filter=upcoming" className="text-gray-500 hover:text-black dark:hover:text-white transition-colors text-sm">Coming Soon</Link></li>
                    </ul>
                  </div>
                  <div className="col-span-3 grid grid-cols-3 gap-6">
                    {megaMenuFeatures.map(feature => (
                      <Link key={feature.id} href={`/product/${feature.id}`} className="group/card cursor-pointer block">
                        <div className="aspect-[4/5] bg-gray-100 dark:bg-gray-900 rounded-2xl overflow-hidden mb-3">
                          <img src={feature.imageUrl} className="w-full h-full object-cover group-hover/card:scale-105 transition-transform duration-700" alt={feature.name}/>
                        </div>
                        <p className="font-bold text-sm text-gray-900 dark:text-white line-clamp-1">{feature.name}</p>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <Link href="/category/men" className="text-xs font-bold tracking-widest uppercase text-gray-900 dark:text-white hover:opacity-50 transition-opacity py-8 h-full flex items-center">
              Men
            </Link>
            <Link href="/category/ladies" className="text-xs font-bold tracking-widest uppercase text-gray-900 dark:text-white hover:opacity-50 transition-opacity py-8 h-full flex items-center">
              Ladies
            </Link>
            <Link href="/category/kids" className="text-xs font-bold tracking-widest uppercase text-gray-900 dark:text-white hover:opacity-50 transition-opacity py-8 h-full flex items-center">
              Kids
            </Link>

            {/* Admin Menu (Funny Worldwide Top 1 showcase) */}
            <div className="group h-full flex items-center">
              <Link href="/admin" className="text-xs font-bold tracking-widest uppercase text-brand hover:opacity-50 transition-opacity py-8 h-full flex items-center">
                Admin
              </Link>
              <div className="absolute top-full left-0 w-full bg-white dark:bg-black border-b border-gray-100 dark:border-gray-900 shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 z-50">
                <div className="max-w-7xl mx-auto px-8 py-10 grid grid-cols-5 gap-8">
                  <div className="col-span-2">
                    <h3 className="font-heading font-black text-3xl tracking-tighter text-gray-900 dark:text-white mb-2">Workspace</h3>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">World-class enterprise management suite.</p>
                    <Link href="/admin/cms" className="inline-block bg-black dark:bg-white text-white dark:text-black font-bold text-xs uppercase tracking-widest px-6 py-3 rounded-full hover:scale-105 transition-transform">
                      Open CMS Builder
                    </Link>
                  </div>
                  <div className="col-span-1">
                    <h4 className="font-bold text-gray-900 dark:text-white mb-4 uppercase tracking-widest text-xs">Catalog</h4>
                    <ul className="space-y-3">
                      <li><Link href="/admin/products" className="text-gray-500 hover:text-brand transition-colors text-sm font-medium">Products</Link></li>
                      <li><Link href="/admin/products/new" className="text-gray-500 hover:text-brand transition-colors text-sm font-medium">Add New</Link></li>
                      <li><Link href="/admin/marketing" className="text-gray-500 hover:text-brand transition-colors text-sm font-medium">Coupons</Link></li>
                    </ul>
                  </div>
                  <div className="col-span-1">
                    <h4 className="font-bold text-gray-900 dark:text-white mb-4 uppercase tracking-widest text-xs">Sales</h4>
                    <ul className="space-y-3">
                      <li><Link href="/admin/orders" className="text-gray-500 hover:text-brand transition-colors text-sm font-medium">Orders</Link></li>
                      <li><Link href="/admin/customers" className="text-gray-500 hover:text-brand transition-colors text-sm font-medium">Customers</Link></li>
                      <li><Link href="/admin/analytics" className="text-gray-500 hover:text-brand transition-colors text-sm font-medium">Analytics</Link></li>
                    </ul>
                  </div>
                  <div className="col-span-1">
                    <h4 className="font-bold text-gray-900 dark:text-white mb-4 uppercase tracking-widest text-xs">System</h4>
                    <ul className="space-y-3">
                      <li><Link href="/admin/settings" className="text-gray-500 hover:text-brand transition-colors text-sm font-medium">Settings</Link></li>
                      <li><Link href="/admin/reviews" className="text-gray-500 hover:text-brand transition-colors text-sm font-medium">Reviews</Link></li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </nav>

          {/* Actions (Right) */}
          <div className="flex items-center gap-1 md:gap-3">
            {mounted && (
              <>
                <button 
                  onClick={() => setLanguage(language === "en" ? "bn" : "en")}
                  className="text-gray-900 dark:text-white hover:opacity-50 transition-opacity hidden md:flex items-center gap-1 p-2 text-xs font-bold uppercase tracking-wider"
                >
                  <Globe className="w-4 h-4" /> {language}
                </button>
                <button 
                  onClick={() => {
                    const currencies: ("BDT" | "USD" | "EUR" | "GBP")[] = ["BDT", "USD", "EUR", "GBP"];
                    const { currency, setCurrency } = useSettingsStore.getState();
                    const nextIndex = (currencies.indexOf(currency) + 1) % currencies.length;
                    setCurrency(currencies[nextIndex]);
                  }}
                  className="text-gray-900 dark:text-white hover:opacity-50 transition-opacity hidden md:flex items-center gap-1 p-2 text-xs font-bold uppercase tracking-wider"
                >
                  {useSettingsStore.getState().currency}
                </button>
                <button 
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  className="text-gray-900 dark:text-white hover:opacity-50 transition-opacity hidden md:block p-2"
                >
                  {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                </button>
              </>
            )}

            <div className="w-px h-4 bg-gray-200 dark:bg-gray-800 mx-2 hidden md:block" />

            <Link href="/shop" className="text-gray-900 dark:text-white hover:opacity-50 transition-opacity hidden md:block p-2">
              <Search className="w-5 h-5" />
            </Link>
            <Link href={session ? "/account" : "/login"} className="text-gray-900 dark:text-white hover:opacity-50 transition-opacity hidden md:block p-2">
              <User className="w-5 h-5" />
            </Link>
            <button 
              onClick={() => useCartStore.getState().openCart()}
              className="text-gray-900 dark:text-white hover:opacity-50 transition-opacity p-2 relative"
            >
              <ShoppingBag className="w-5 h-5" />
              {mounted && cartItemCount > 0 && (
                <span className="absolute top-1 right-0 w-4 h-4 bg-black text-white dark:bg-white dark:text-black text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-white dark:border-black">
                  {cartItemCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>

    {/* Mobile Menu Drawer */}
    {isMobileMenuOpen && (
      <div className="fixed inset-0 z-[60] flex md:hidden">
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity" onClick={() => setIsMobileMenuOpen(false)} />
        <div className="relative w-4/5 max-w-sm bg-white dark:bg-gray-950 h-full overflow-y-auto shadow-2xl animate-in slide-in-from-left duration-300 flex flex-col">
          <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-900">
            <span className="font-heading font-black text-xl tracking-tighter text-gray-900 dark:text-white">
              FAITHHUB<span className="opacity-50">BD</span>
            </span>
            <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-900 rounded-full text-gray-500 transition-colors">
              <X className="w-6 h-6" />
            </button>
          </div>
          
          <nav className="flex-1 p-6 space-y-6">
            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400">Categories</h4>
              <Link href="/category/new" onClick={() => setIsMobileMenuOpen(false)} className="block text-lg font-bold text-gray-900 dark:text-white hover:text-brand transition-colors">New Arrivals</Link>
              <Link href="/category/men" onClick={() => setIsMobileMenuOpen(false)} className="block text-lg font-bold text-gray-900 dark:text-white hover:text-brand transition-colors">Men</Link>
              <Link href="/category/ladies" onClick={() => setIsMobileMenuOpen(false)} className="block text-lg font-bold text-gray-900 dark:text-white hover:text-brand transition-colors">Ladies</Link>
              <Link href="/category/kids" onClick={() => setIsMobileMenuOpen(false)} className="block text-lg font-bold text-gray-900 dark:text-white hover:text-brand transition-colors">Kids</Link>
            </div>

            <div className="pt-6 border-t border-gray-100 dark:border-gray-900 space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400">Account</h4>
              {session ? (
                <>
                  <Link href="/account" onClick={() => setIsMobileMenuOpen(false)} className="block text-lg font-bold text-gray-900 dark:text-white hover:text-brand transition-colors">My Dashboard</Link>
                  <Link href="/account/orders" onClick={() => setIsMobileMenuOpen(false)} className="block text-lg font-bold text-gray-900 dark:text-white hover:text-brand transition-colors">Order History</Link>
                </>
              ) : (
                <Link href="/login" onClick={() => setIsMobileMenuOpen(false)} className="block text-lg font-bold text-gray-900 dark:text-white hover:text-brand transition-colors">Sign In</Link>
              )}
              {session?.user && (
                <Link href="/admin" onClick={() => setIsMobileMenuOpen(false)} className="block text-lg font-bold text-brand hover:opacity-70 transition-colors">Admin Panel</Link>
              )}
            </div>
            
            <div className="pt-6 border-t border-gray-100 dark:border-gray-900 flex gap-4">
              <button 
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="flex-1 bg-gray-50 dark:bg-gray-900 p-4 rounded-xl flex items-center justify-center text-gray-900 dark:text-white font-bold"
              >
                {theme === "dark" ? <Sun className="w-5 h-5 mr-2" /> : <Moon className="w-5 h-5 mr-2" />}
                {theme === "dark" ? "Light" : "Dark"}
              </button>
              
              <button 
                onClick={() => {
                  const currencies: ("BDT" | "USD" | "EUR" | "GBP")[] = ["BDT", "USD", "EUR", "GBP"];
                  const { currency, setCurrency } = useSettingsStore.getState();
                  const nextIndex = (currencies.indexOf(currency) + 1) % currencies.length;
                  setCurrency(currencies[nextIndex]);
                }}
                className="flex-1 bg-gray-50 dark:bg-gray-900 p-4 rounded-xl flex items-center justify-center text-gray-900 dark:text-white font-bold"
              >
                {useSettingsStore.getState().currency}
              </button>
            </div>
          </nav>
        </div>
      </div>
    )}
    </>
  );
}
