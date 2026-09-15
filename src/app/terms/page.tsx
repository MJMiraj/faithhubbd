import { InfoPage } from "@/components/layout/InfoPage";

export default function TermsPage() {
  return (
    <InfoPage 
      title="Terms of Service" 
      description="The rules and guidelines for using the FaithHub BD digital platform."
      content={
        <div className="space-y-6">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">1. Acceptance of Terms</h3>
          <p>By accessing and using FaithHub BD, you accept and agree to be bound by the terms and provision of this agreement. In addition, when using these particular services, you shall be subject to any posted guidelines or rules applicable to such services.</p>
          
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">2. Products and Pricing</h3>
          <p>All prices for our premium apparel are listed in Bangladeshi Taka (BDT). We reserve the right to modify prices at any time without prior notice. However, once an order is placed and confirmed, the price remains locked.</p>
          
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">3. Intellectual Property</h3>
          <p>All content included on this site, such as text, graphics, logos, button icons, images, and software, is the property of FaithHub BD or its content suppliers and protected by international copyright laws.</p>
          
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">4. User Conduct</h3>
          <p>Users are strictly prohibited from utilizing the platform for any illegal activities, uploading malicious code, or attempting to breach the security infrastructure of our e-commerce platform.</p>
        </div>
      }
    />
  );
}
