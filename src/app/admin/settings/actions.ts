"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function updateStoreSettings(formData: FormData) {
  try {
    const storeName = formData.get("storeName") as string;
    const currency = formData.get("currency") as string;
    const contactPhone = formData.get("contactPhone") as string;
    const contactEmail = formData.get("contactEmail") as string;
    const address = formData.get("address") as string;
    const whatsappNumber = formData.get("whatsappNumber") as string;
    const freeShippingThresholdStr = formData.get("freeShippingThreshold") as string;
    const freeShippingThreshold = freeShippingThresholdStr ? parseFloat(freeShippingThresholdStr) : null;

    await db.storeSettings.upsert({
      where: { id: "global_settings" },
      update: {
        storeName,
        currency,
        contactPhone,
        contactEmail,
        address,
        whatsappNumber,
        freeShippingThreshold
      },
      create: {
        id: "global_settings",
        storeName,
        currency,
        contactPhone,
        contactEmail,
        address,
        whatsappNumber,
        freeShippingThreshold
      }
    });

    revalidatePath("/admin/settings");
    revalidatePath("/");
    revalidatePath("/checkout");
    
    return { success: true };
  } catch (error) {
    console.error("Failed to update settings:", error);
    return { error: "Failed to save settings." };
  }
}
