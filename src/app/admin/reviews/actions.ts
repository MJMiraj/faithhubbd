"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function approveReview(id: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user) throw new Error("Unauthorized");

  await db.productReview.update({
    where: { id },
    data: { isApproved: true }
  });

  revalidatePath("/admin/reviews");
  revalidatePath("/product/[id]", "page");
}

export async function deleteReview(id: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user) throw new Error("Unauthorized");

  await db.productReview.delete({
    where: { id }
  });

  revalidatePath("/admin/reviews");
  revalidatePath("/product/[id]", "page");
}
