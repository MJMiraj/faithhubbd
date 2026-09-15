"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function createPaymentAccount(data: { provider: string; type: string; number: string }) {
  try {
    await db.mobileBankingAccount.create({ data });
    revalidatePath("/admin/settings/payment");
    revalidatePath("/checkout");
    return { success: true };
  } catch (error) {
    return { error: "Failed to create account" };
  }
}

export async function deletePaymentAccount(id: string) {
  try {
    await db.mobileBankingAccount.delete({ where: { id } });
    revalidatePath("/admin/settings/payment");
    revalidatePath("/checkout");
    return { success: true };
  } catch (error) {
    return { error: "Failed to delete account" };
  }
}

export async function togglePaymentAccount(id: string, isActive: boolean) {
  try {
    await db.mobileBankingAccount.update({ where: { id }, data: { isActive } });
    revalidatePath("/admin/settings/payment");
    revalidatePath("/checkout");
    return { success: true };
  } catch (error) {
    return { error: "Failed to toggle account" };
  }
}
