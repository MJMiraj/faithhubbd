import { db } from "@/lib/db";
import { PaymentSettingsClient } from "./PaymentSettingsClient";
import { CreditCard } from "lucide-react";

export default async function PaymentSettingsPage() {
  const accounts = await db.mobileBankingAccount.findMany({
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-gray-900 flex items-center gap-3">
          <CreditCard className="w-8 h-8 text-brand" />
          Mobile Banking Accounts
        </h2>
        <p className="text-gray-500 mt-1 font-medium text-sm">
          Manage your manual bKash, Nagad, and Rocket numbers displayed at checkout.
        </p>
      </div>
      
      <PaymentSettingsClient accounts={accounts} />
    </div>
  );
}
