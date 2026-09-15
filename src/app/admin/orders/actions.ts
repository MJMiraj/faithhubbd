"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

import { dispatchOrderToCourier } from "@/lib/courier";

export async function updateOrderStatus(orderId: string, status: string, paymentStatus: string) {
  try {
    await db.order.update({
      where: { id: orderId },
      data: { 
        status,
        paymentStatus
      }
    });
    
    revalidatePath("/admin/orders");
    revalidatePath(`/admin/orders/${orderId}`);
    
    return { success: true };
  } catch (error) {
    return { error: "Failed to update order status." };
  }
}

export async function dispatchOrderAction(orderId: string) {
  const result = await dispatchOrderToCourier(orderId);
  if (result.success) {
    revalidatePath("/admin/orders");
    revalidatePath(`/admin/orders/${orderId}`);
  }
  return result;
}
