"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

async function verifyAdmin() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) throw new Error("Unauthorized");
  
  const user = await db.user.findUnique({
    where: { email: session.user.email },
    include: { role: true }
  });
  
  const allowedRoles = ["Admin", "Super Admin", "Staff"];
  if (!user?.role?.name || !allowedRoles.includes(user.role.name)) {
    throw new Error("Forbidden");
  }
}

export async function createProduct(formData: FormData) {
  await verifyAdmin();
  const name = formData.get("name") as string;
  const sku = formData.get("sku") as string;
  const price = parseFloat(formData.get("price") as string);
  const categoryId = formData.get("categoryId") as string;
  const description = formData.get("description") as string;
  const imagesJson = formData.get("images") as string;
  let imageUrls: string[] = [];
  try {
    if (imagesJson) imageUrls = JSON.parse(imagesJson);
  } catch (e) {}

  const isCombo = formData.get("isCombo") === "true";
  const isOffer = formData.get("isOffer") === "true";
  const isUpcoming = formData.get("isUpcoming") === "true";
  const isPreBooking = formData.get("isPreBooking") === "true";
  const discountPercent = formData.get("discountPercent") ? parseFloat(formData.get("discountPercent") as string) : 0;
  const availableDate = formData.get("availableDate") ? new Date(formData.get("availableDate") as string) : null;

  const attributesJson = formData.get("attributes") as string;
  let attributesData: { name: string, value: string }[] = [];
  try {
    if (attributesJson) attributesData = JSON.parse(attributesJson);
  } catch(e) {}

  if (!name || !sku || !price || !categoryId) {
    return { error: "Missing required fields." };
  }

  // Generate slug
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");

  try {
    const product = await db.product.create({
      data: {
        name,
        slug,
        sku,
        basePrice: price,
        categoryId,
        description,
        isCombo,
        isOffer,
        isUpcoming,
        isPreBooking,
        discountPercent,
        availableDate,
        images: imageUrls.length > 0 ? {
          create: imageUrls.map((url, idx) => ({
            url,
            isPrimary: idx === 0,
            order: idx
          }))
        } : undefined,
        attributes: attributesData.length > 0 ? {
          create: attributesData.map(attr => ({
            name: attr.name,
            value: attr.value
          }))
        } : undefined
      }
    });

    revalidatePath("/admin/products");
    revalidatePath("/");
    
    return { success: true, productId: product.id };
  } catch (error: any) {
    console.error("Failed to create product:", error);
    if (error.code === 'P2002') {
      return { error: "A product with this SKU or Name already exists." };
    }
    return { error: "Internal server error." };
  }
}

export async function updateProduct(id: string, formData: FormData) {
  await verifyAdmin();
  const name = formData.get("name") as string;
  const sku = formData.get("sku") as string;
  const price = parseFloat(formData.get("price") as string);
  const categoryId = formData.get("categoryId") as string;
  const description = formData.get("description") as string;
  const imagesJson = formData.get("images") as string;
  let imageUrls: string[] = [];
  try {
    if (imagesJson) imageUrls = JSON.parse(imagesJson);
  } catch (e) {}

  const isCombo = formData.get("isCombo") === "true";
  const isOffer = formData.get("isOffer") === "true";
  const isUpcoming = formData.get("isUpcoming") === "true";
  const isPreBooking = formData.get("isPreBooking") === "true";
  const discountPercent = formData.get("discountPercent") ? parseFloat(formData.get("discountPercent") as string) : 0;
  const availableDate = formData.get("availableDate") ? new Date(formData.get("availableDate") as string) : null;

  const attributesJson = formData.get("attributes") as string;
  let attributesData: { name: string, value: string }[] = [];
  try {
    if (attributesJson) attributesData = JSON.parse(attributesJson);
  } catch(e) {}

  if (!name || !sku || !price || !categoryId) {
    return { error: "Missing required fields." };
  }

  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");

  try {
    // Delete existing images to replace them (naive approach for MVP)
    await db.productImage.deleteMany({
      where: { productId: id }
    });
    
    // Delete existing attributes to replace them
    await db.productAttribute.deleteMany({
      where: { productId: id }
    });

    await db.product.update({
      where: { id },
      data: {
        name,
        slug,
        sku,
        basePrice: price,
        categoryId,
        description,
        isCombo,
        isOffer,
        isUpcoming,
        isPreBooking,
        discountPercent,
        availableDate,
        images: imageUrls.length > 0 ? {
          create: imageUrls.map((url, idx) => ({
            url,
            isPrimary: idx === 0,
            order: idx
          }))
        } : undefined,
        attributes: attributesData.length > 0 ? {
          create: attributesData.map(attr => ({
            name: attr.name,
            value: attr.value
          }))
        } : undefined
      }
    });

    revalidatePath("/admin/products");
    revalidatePath("/");
    revalidatePath(`/product/${id}`);
    
    return { success: true };
  } catch (error: any) {
    console.error("Failed to update product:", error);
    if (error.code === 'P2002') {
      return { error: "A product with this SKU or Name already exists." };
    }
    return { error: "Internal server error." };
  }
}

export async function softDeleteProduct(id: string) {
  try {
    await verifyAdmin();
    await db.product.update({
      where: { id },
      data: { isActive: false }
    });
    
    revalidatePath("/admin/products");
    revalidatePath("/");
    
    return { success: true };
  } catch (error) {
    return { error: "Failed to delete product." };
  }
}
