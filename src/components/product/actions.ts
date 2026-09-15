"use server";

import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function submitReview(productId: string, rating: number, comment: string) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.email) {
    return { error: "You must be logged in to leave a review." };
  }

  const user = await db.user.findUnique({ where: { email: session.user.email } });
  if (!user) {
    return { error: "User not found." };
  }

  // Check if user has already reviewed this product
  const existingReview = await db.productReview.findFirst({
    where: { productId, userId: user.id }
  });

  if (existingReview) {
    return { error: "You have already reviewed this product." };
  }

  await db.productReview.create({
    data: {
      productId,
      userId: user.id,
      rating,
      comment
    }
  });

  revalidatePath(`/product/[id]`, 'page');
  return { success: true };
}
