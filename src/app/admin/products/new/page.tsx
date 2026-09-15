import { db } from "@/lib/db";
import { ProductForm } from "./ProductForm";

export default async function NewProductPage() {
  const categories = await db.category.findMany({
    orderBy: { name: 'asc' }
  });

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl md:text-4xl font-heading font-black text-gray-900 dark:text-white tracking-tight">Add New Product</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2 font-medium">Create a new product listing in your catalog.</p>
      </div>

      <div className="bg-white dark:bg-black rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm p-8">
        <ProductForm categories={categories} />
      </div>
    </div>
  );
}
