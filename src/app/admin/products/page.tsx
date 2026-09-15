import { db } from "@/lib/db";
import Image from "next/image";
import Link from "next/link";
import { Plus, Edit, Trash2 } from "lucide-react";

export default async function AdminProductsPage() {
  const products = await db.product.findMany({
    where: { isActive: true },
    include: {
      category: true,
      images: {
        where: { isPrimary: true },
        take: 1
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl md:text-4xl font-heading font-black text-gray-900 dark:text-white tracking-tight">Products</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2 font-medium">Manage your catalog and inventory.</p>
        </div>
        <Link href="/admin/products/new" className="bg-brand text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-brand-dark transition-transform hover:scale-105 active:scale-95 shadow-lg shadow-brand/20">
          <Plus className="w-5 h-5" /> Add Product
        </Link>
      </div>

      <div className="bg-white dark:bg-black rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-100 dark:border-gray-800">
                <th className="px-6 py-5 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">Product</th>
                <th className="px-6 py-5 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">SKU</th>
                <th className="px-6 py-5 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">Category</th>
                <th className="px-6 py-5 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">Price</th>
                <th className="px-6 py-5 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {products.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                    No products found. Start by adding a new one.
                  </td>
                </tr>
              ) : null}
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors group">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-xl bg-gray-100 dark:bg-gray-800 overflow-hidden shrink-0 border border-gray-100 dark:border-gray-800 relative">
                        {product.images[0]?.url ? (
                          <img src={product.images[0].url} alt={product.name} className="h-full w-full object-cover" />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center text-xs font-medium text-gray-400 dark:text-gray-500">Img</div>
                        )}
                      </div>
                      <div>
                        <p className="font-bold text-gray-900 dark:text-white line-clamp-1">{product.name}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-sm font-medium text-gray-500 dark:text-gray-400">{product.sku}</td>
                  <td className="px-6 py-5">
                    <span className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded-full text-xs font-bold whitespace-nowrap">
                      {product.category.name}
                    </span>
                  </td>
                  <td className="px-6 py-5 font-bold text-gray-900 dark:text-white whitespace-nowrap">৳ {product.basePrice}</td>
                  <td className="px-6 py-5 text-right space-x-2">
                    <Link href={`/admin/products/edit/${product.id}`} className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-xl transition-colors inline-flex opacity-0 group-hover:opacity-100 focus:opacity-100">
                      <Edit className="w-5 h-5" />
                    </Link>
                    <form action={async () => {
                      "use server";
                      const { softDeleteProduct } = await import("../actions");
                      await softDeleteProduct(product.id);
                    }} className="inline-block">
                      <button type="submit" className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-colors inline-flex opacity-0 group-hover:opacity-100 focus:opacity-100">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </form>
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
