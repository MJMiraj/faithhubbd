"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function createCoupon(formData: FormData) {
  const code = formData.get("code") as string;
  const discountType = formData.get("discountType") as string;
  const discountValue = parseFloat(formData.get("discountValue") as string);
  const minPurchase = formData.get("minPurchase") ? parseFloat(formData.get("minPurchase") as string) : null;
  const maxDiscount = formData.get("maxDiscount") ? parseFloat(formData.get("maxDiscount") as string) : null;
  const validFrom = new Date(formData.get("validFrom") as string);
  const validUntil = new Date(formData.get("validUntil") as string);
  const isActive = formData.get("isActive") === "true";
  const usageLimit = formData.get("usageLimit") ? parseInt(formData.get("usageLimit") as string) : null;

  if (!code || !discountType || isNaN(discountValue) || !validFrom || !validUntil) {
    return { error: "Missing required fields." };
  }

  try {
    await db.coupon.create({
      data: {
        code: code.toUpperCase(),
        discountType,
        discountValue,
        minPurchase,
        maxDiscount,
        validFrom,
        validUntil,
        isActive,
        usageLimit
      }
    });

    revalidatePath("/admin/marketing");
    
    return { success: true };
  } catch (error: any) {
    console.error("Failed to create coupon:", error);
    if (error.code === 'P2002') {
      return { error: "A coupon with this code already exists." };
    }
    return { error: "Internal server error." };
  }
}

export async function deleteCoupon(id: string) {
  try {
    await db.coupon.delete({
      where: { id }
    });
    
    revalidatePath("/admin/marketing");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete coupon:", error);
    return { error: "Failed to delete" };
  }
}
