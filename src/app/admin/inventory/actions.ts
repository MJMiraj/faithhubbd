"use server";

import { db } from "@/lib/db";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function adjustInventory(productId: string, quantityChange: number, reason: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return { error: "Unauthorized" };
  }

  try {
    const type = quantityChange >= 0 ? "IN" : "OUT";
    const absChange = Math.abs(quantityChange);

    await db.$transaction(async (tx) => {
      const inventory = await tx.inventory.upsert({
        where: { productId },
        update: {
          quantity: { increment: quantityChange }
        },
        create: {
          productId,
          quantity: quantityChange,
          lowStock: 5
        }
      });

      await tx.stockMovement.create({
        data: {
          inventoryId: inventory.id,
          quantity: absChange,
          type: type,
          reason: reason
        }
      });
    });

    revalidatePath("/admin/inventory");
    return { success: true };
  } catch (error: any) {
    console.error("Inventory error:", error);
    return { error: "Failed to update inventory" };
  }
}
