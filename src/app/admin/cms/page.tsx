import { db } from "@/lib/db";
import { Plus, LayoutTemplate, Trash2, Edit } from "lucide-react";
import Link from "next/link";
import { deleteBanner } from "./actions";

export default async function CMSPage() {
  const banners = await db.banner.findMany({
    orderBy: { order: 'asc' }
  });

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl md:text-4xl font-heading font-black text-gray-900 dark:text-white tracking-tight">Store CMS</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2 font-medium">Manage homepage sliders, banners, and dynamic sections.</p>
        </div>
        <Link href="/admin/cms/new" className="bg-brand text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-brand-dark transition-transform hover:scale-105 active:scale-95 shadow-lg shadow-brand/20">
          <Plus className="w-5 h-5" /> Add Slider
        </Link>
      </div>

      <div className="bg-white dark:bg-black rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden p-8">
        <h2 className="text-xl font-black text-gray-900 dark:text-white flex items-center gap-2 mb-6">
          <LayoutTemplate className="w-6 h-6 text-brand" /> Homepage Sliders (Hero)
        </h2>
        
        {banners.length === 0 ? (
           <div className="text-center py-12 bg-gray-50 dark:bg-gray-900/50 rounded-2xl border border-gray-100 dark:border-gray-800">
            <p className="text-gray-500 dark:text-gray-400 font-medium">No sliders found. The homepage is currently empty.</p>
           </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {banners.map((banner) => (
              <div key={banner.id} className="group relative rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden bg-gray-50 dark:bg-gray-900 hover:border-brand transition-colors">
                <div className="aspect-[21/9] w-full relative">
                  <img src={banner.imageUrl} alt={banner.title || "Banner"} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                    <form action={async () => {
                      "use server";
                      await deleteBanner(banner.id);
                    }}>
                      <button type="submit" className="bg-red-600 text-white p-3 rounded-full hover:scale-110 transition-transform">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </form>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-gray-900 dark:text-white truncate">{banner.title || "Untitled Slider"}</h3>
                  <div className="flex items-center justify-between mt-2 text-sm text-gray-500 dark:text-gray-400">
                    <span>Order: {banner.order}</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${banner.isActive ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>
                      {banner.isActive ? "Active" : "Hidden"}
                    </span>
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
