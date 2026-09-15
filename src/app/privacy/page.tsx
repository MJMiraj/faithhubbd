import { InfoPage } from "@/components/layout/InfoPage";

export default function PrivacyPage() {
  return (
    <InfoPage 
      title="Privacy Policy" 
      description="Your data security is our top priority. Learn how we protect your information."
      content={
        <div className="space-y-6">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">1. Information We Collect</h3>
          <p>At FaithHub BD, we collect information to provide better services to all our users. This includes basic information like your name, email address, and shipping details when you create an account or place an order.</p>
          
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">2. How We Use Information</h3>
          <p>We use the information we collect to process your transactions, deliver your apparel, and send you important updates about your order via email or WhatsApp.</p>
          
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">3. Information Security</h3>
          <p>We work hard to protect FaithHub BD and our users from unauthorized access to or unauthorized alteration, disclosure, or destruction of information we hold. We use industry-standard encryption protocols to secure your data.</p>
          
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">4. Your Rights</h3>
          <p>You have the right to request access to the personal data we hold about you and to ask that your personal data be corrected, updated, or deleted. If you would like to exercise this right, please contact us at masudalnoor90@gmail.com.</p>
        </div>
      }
    />
  );
}
