import Link from "next/link";
import { MapPin, Phone, Mail, MessageCircle } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-[#050505] text-gray-400 pt-20 pb-10 border-t border-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Brand Col */}
          <div className="space-y-6">
            <Link href="/" className="inline-block">
              <span className="font-heading font-black text-2xl tracking-tighter text-white">
                FAITHHUB<span className="text-brand">BD</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-gray-500 pr-4">
              Premium sports apparel, jerseys, and lifestyle clothing delivered right to your doorstep across Bangladesh.
            </p>
            <a href="https://api.whatsapp.com/send?phone=01852379890" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#128C7E] text-white px-5 py-2.5 rounded-full font-bold text-sm transition-colors">
              <MessageCircle className="w-4 h-4" /> Order via WhatsApp
            </a>
          </div>

          {/* Shop */}
          <div>
            <h3 className="font-heading font-bold text-white text-sm tracking-widest uppercase mb-6">Shop</h3>
            <ul className="space-y-4 text-sm font-medium">
              <li><Link href="/category/new" className="hover:text-brand transition-colors">New Arrivals</Link></li>
              <li><Link href="/category/men" className="hover:text-brand transition-colors">Men's Collection</Link></li>
              <li><Link href="/category/ladies" className="hover:text-brand transition-colors">Ladies' Collection</Link></li>
              <li><Link href="/category/kids" className="hover:text-brand transition-colors">Kids' Collection</Link></li>
              <li><Link href="/sale" className="text-brand hover:text-brand-light transition-colors">On Sale</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-heading font-bold text-white text-sm tracking-widest uppercase mb-6">Support</h3>
            <ul className="space-y-4 text-sm font-medium">
              <li><Link href="/wholesale" className="hover:text-brand transition-colors text-brand font-bold">Wholesale / B2B Portal</Link></li>
              <li><Link href="/help" className="hover:text-brand transition-colors">Help Center</Link></li>
              <li><Link href="/shipping" className="hover:text-brand transition-colors">Shipping & Delivery</Link></li>
              <li><Link href="/returns" className="hover:text-brand transition-colors">Returns & Exchanges</Link></li>
              <li><Link href="/size-guide" className="hover:text-brand transition-colors">Size Guide</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-heading font-bold text-white text-sm tracking-widest uppercase mb-6">Contact</h3>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                <span>Uttara Sector-9, Road-5, House-3, Floor-1,<br/>Dhaka, Bangladesh</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-gray-500 flex-shrink-0" />
                <span>+880 1852-379890</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-gray-500 flex-shrink-0" />
                <span>masudalnoor90@gmail.com</span>
              </li>
            </ul>
          </div>

        </div>

        <div className="border-t border-gray-900 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-medium">
          <p className="text-gray-600">
            &copy; {new Date().getFullYear()} FaithHub BD. All rights reserved.
          </p>
          <div className="flex gap-6 text-gray-600">
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
