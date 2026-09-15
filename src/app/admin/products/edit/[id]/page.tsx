import { db } from "@/lib/db";
import { ProductForm } from "../../new/ProductForm";
import { notFound } from "next/navigation";

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const product = await db.product.findUnique({
    where: { id },
    include: {
      images: true,
      attributes: true,
    }
  });

  if (!product) {
    notFound();
  }

  const categories = await db.category.findMany({
    orderBy: { name: 'asc' }
  });

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-heading font-black text-gray-900">Edit Product</h1>
        <p className="text-gray-500 mt-2">Update product details and inventory.</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
        <ProductForm categories={categories} product={product} />
      </div>
    </div>
  );
}
