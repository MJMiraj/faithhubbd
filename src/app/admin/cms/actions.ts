"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function createBanner(formData: FormData) {
  const title = formData.get("title") as string;
  const link = formData.get("link") as string;
  const order = parseInt(formData.get("order") as string) || 0;
  const isActive = formData.get("isActive") === "true";
  
  const imagesJson = formData.get("images") as string;
  let imageUrls: string[] = [];
  try {
    if (imagesJson) imageUrls = JSON.parse(imagesJson);
  } catch (e) {}

  if (imageUrls.length === 0) {
    return { error: "Please upload an image for the slider." };
  }

  try {
    await db.banner.create({
      data: {
        title,
        link,
        order,
        isActive,
        imageUrl: imageUrls[0] // Just take the first image
      }
    });

    revalidatePath("/admin/cms");
    revalidatePath("/");
    
    return { success: true };
  } catch (error: any) {
    console.error("Failed to create banner:", error);
    return { error: "Internal server error." };
  }
}

export async function deleteBanner(id: string) {
  try {
    await db.banner.delete({
      where: { id }
    });
    
    revalidatePath("/admin/cms");
    revalidatePath("/");
    
    return { success: true };
  } catch (error) {
    console.error("Failed to delete banner:", error);
    return { error: "Failed to delete" };
  }
}
