import { db } from "@/lib/db";
import { InventoryList } from "@/components/admin/inventory/InventoryList";
import { Package } from "lucide-react";

export default async function InventoryPage() {
  const products = await db.product.findMany({
    where: { isActive: true },
    select: {
      id: true,
      name: true,
      sku: true,
      basePrice: true,
      inventory: {
        select: {
          quantity: true,
          lowStock: true,
          movements: {
            orderBy: { createdAt: 'desc' },
            take: 5
          }
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-heading font-black text-gray-900 dark:text-white tracking-tight flex items-center gap-3">
            <Package className="w-8 h-8 text-brand" />
            Inventory Management
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2 font-medium">Monitor stock levels and log warehouse adjustments.</p>
        </div>
      </div>

      <InventoryList products={products} />
    </div>
  );
}
