import { InfoPage } from "@/components/layout/InfoPage";
import { Truck, Clock, ShieldCheck, Globe } from "lucide-react";

export default function ShippingPage() {
  return (
    <InfoPage 
      title="Shipping & Delivery" 
      description="Learn about our world-class delivery partners and shipping timelines across Bangladesh."
      content={
        <div className="space-y-12 mt-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 bg-gray-50 dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800">
              <Truck className="w-8 h-8 mb-4 text-black dark:text-white" />
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Inside Dhaka</h3>
              <p className="text-sm">Delivery within 24-48 hours. Standard charge ৳60. Cash on delivery available.</p>
            </div>
            <div className="p-6 bg-gray-50 dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800">
              <Globe className="w-8 h-8 mb-4 text-black dark:text-white" />
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Outside Dhaka</h3>
              <p className="text-sm">Delivery within 3-5 working days. Standard charge ৳120. Pre-payment required for some locations.</p>
            </div>
            <div className="p-6 bg-gray-50 dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800">
              <Clock className="w-8 h-8 mb-4 text-black dark:text-white" />
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Express Delivery</h3>
              <p className="text-sm">Same-day delivery available for specific zones in Dhaka. Additional ৳100 applies.</p>
            </div>
          </div>
          
          <div className="prose prose-lg dark:prose-invert">
            <h3>Order Tracking</h3>
            <p>Once your order is dispatched, you will receive an SMS and WhatsApp message with your tracking ID. You can use this ID to track your premium package in real-time through our delivery partner's website.</p>
            
            <h3>Free Shipping</h3>
            <p>Enjoy free shipping on all orders over ৳1500 across Bangladesh. The free shipping discount will automatically apply at checkout.</p>
          </div>
        </div>
      }
    />
  );
}
