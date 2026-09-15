import { CheckoutForm } from "./CheckoutForm";
import { ShieldCheck } from "lucide-react";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export default async function CheckoutPage() {
  const settings = await db.storeSettings.findUnique({ where: { id: "global_settings" } });
  const freeShippingThreshold = settings?.freeShippingThreshold !== null ? settings?.freeShippingThreshold : 1500;

  let shippingMethods = await db.shippingMethod.findMany({
    orderBy: { price: 'asc' }
  });

  if (shippingMethods.length === 0) {
    await db.shippingMethod.createMany({
      data: [
        { name: "Inside Dhaka", price: 100, estimatedDays: "1-2 Days" },
        { name: "Outside Dhaka", price: 150, estimatedDays: "3-5 Days" }
      ]
    });
    shippingMethods = await db.shippingMethod.findMany({
      orderBy: { price: 'asc' }
    });
  }

  const mobileBankingAccounts = await db.mobileBankingAccount.findMany({
    where: { isActive: true }
  });

  const session = await getServerSession(authOptions);
  let savedAddresses: any[] = [];
  let userDetails: any = null;

  if (session?.user?.email) {
    const user = await db.user.findUnique({
      where: { email: session.user.email },
      include: {
        addresses: true
      }
    });
    if (user) {
      userDetails = {
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email,
        phone: user.phone || ""
      };
      savedAddresses = user.addresses;
    }
  }

  return (
    <div className="relative min-h-screen bg-gray-50/50">
      {/* Decorative background blob */}
      <div className="absolute top-0 inset-x-0 h-64 bg-gradient-to-b from-brand/10 to-transparent pointer-events-none -z-10" />

      <div className="max-w-6xl mx-auto py-12 px-4 md:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-4">
          <div>
            <h1 className="text-4xl md:text-5xl font-heading font-black text-gray-900 tracking-tight">Complete Order</h1>
            <p className="text-gray-500 font-semibold mt-2 text-lg">Almost there! Let's get your order finalized securely.</p>
          </div>
          <div className="bg-white/80 backdrop-blur-md text-brand px-6 py-3 rounded-2xl font-bold text-sm flex items-center gap-3 shadow-lg shadow-brand/5 border border-brand/10">
            <ShieldCheck className="w-5 h-5" /> SSL Encrypted Checkout
          </div>
        </div>

        <CheckoutForm 
          shippingMethods={shippingMethods} 
          freeShippingThreshold={freeShippingThreshold} 
          mobileBankingAccounts={mobileBankingAccounts}
          savedAddresses={savedAddresses}
          userDetails={userDetails}
        />
      </div>
    </div>
  );
}
