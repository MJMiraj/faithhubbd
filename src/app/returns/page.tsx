import { InfoPage } from "@/components/layout/InfoPage";
import { RotateCcw, Shield } from "lucide-react";

export default function ReturnsPage() {
  return (
    <InfoPage 
      title="Returns & Exchanges" 
      description="Our hassle-free return policy ensures you are 100% satisfied with your premium apparel."
      content={
        <div className="space-y-8">
          <div className="p-8 bg-black text-white dark:bg-white dark:text-black rounded-3xl mb-12">
            <h3 className="text-2xl font-bold mb-4 flex items-center gap-3"><RotateCcw className="w-6 h-6" /> The 7-Day Guarantee</h3>
            <p className="text-lg opacity-90">If you are not entirely satisfied with your purchase, you have 7 days from the date of delivery to return or exchange the item. No questions asked.</p>
          </div>

          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Conditions for Return</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>The item must be unused and in the same condition that you received it.</li>
            <li>The item must be in the original packaging with all tags attached.</li>
            <li>You must provide the original receipt or proof of purchase.</li>
            <li>Discounted items or items purchased during flash sales are strictly non-refundable and non-exchangeable.</li>
          </ul>

          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-12">How to Request a Return</h3>
          <p>Simply send a message to our WhatsApp support number (+880 1852-379890) with your Order ID and the reason for the return. Our team will schedule a pickup within 24-48 hours.</p>

          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-12">Refund Process</h3>
          <p>Once we receive and inspect the returned item, we will notify you via WhatsApp. If approved, the refund will be processed immediately to your bKash, Nagad, or Bank Account. Shipping charges are non-refundable.</p>
        </div>
      }
    />
  );
}
