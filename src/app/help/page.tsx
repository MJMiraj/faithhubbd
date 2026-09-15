import { InfoPage } from "@/components/layout/InfoPage";
import { MessageCircle, Phone, Mail } from "lucide-react";

export default function HelpPage() {
  return (
    <InfoPage 
      title="Help Center" 
      description="How can we assist you today? Our support team is available to help you with your premium orders."
      content={
        <div className="space-y-12 mt-8">
          <p className="text-lg mb-8">Whether you have a question about an order, need styling advice, or want to inquire about bulk corporate orders, we are just a message away.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-8 bg-gray-50 dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 text-center flex flex-col items-center">
              <MessageCircle className="w-12 h-12 mb-4 text-[#25D366]" />
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">WhatsApp Support</h3>
              <p className="text-sm text-gray-500 mb-6">Fastest response time. Available 9 AM to 10 PM daily.</p>
              <a href="https://api.whatsapp.com/send?phone=01852379890" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#128C7E] text-white px-6 py-3 rounded-full font-bold text-sm transition-colors">
                Chat on WhatsApp
              </a>
            </div>

            <div className="p-8 bg-gray-50 dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 text-center flex flex-col items-center">
              <Phone className="w-12 h-12 mb-4 text-black dark:text-white" />
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Direct Call</h3>
              <p className="text-sm text-gray-500 mb-6">Speak with our customer experience team directly.</p>
              <a href="tel:01852379890" className="inline-flex items-center gap-2 bg-black dark:bg-white text-white dark:text-black px-6 py-3 rounded-full font-bold text-sm hover:scale-105 transition-transform">
                +880 1852-379890
              </a>
            </div>
          </div>
          
          <div className="p-8 bg-gray-50 dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 text-center flex flex-col items-center">
            <Mail className="w-8 h-8 mb-4 text-black dark:text-white" />
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Email Inquiries</h3>
            <p className="text-sm text-gray-500 mb-2">For business, wholesale, or formal inquiries.</p>
            <a href="mailto:masudalnoor90@gmail.com" className="font-bold text-brand hover:underline">masudalnoor90@gmail.com</a>
          </div>
        </div>
      }
    />
  );
}
