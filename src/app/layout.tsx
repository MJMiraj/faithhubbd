import type { Metadata, Viewport } from "next";
import { Inter, Outfit, Roboto } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Providers } from "@/components/Providers";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { db } from "@/lib/db";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const roboto = Roboto({
  variable: "--font-roboto",
  weight: ["300", "400", "500", "700", "900"],
  subsets: ["latin"],
});

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "FaithHub BD | Worldwide Top 1 Ecommerce",
  description: "Experience the next generation of e-commerce.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "FaithHub",
  },
};

export const viewport: Viewport = {
  themeColor: "#000000",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let settings = null;
  let featuredProducts: any[] = [];

  try {
    settings = await db.storeSettings.findUnique({ where: { id: "global_settings" } });
    featuredProducts = await db.product.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' },
      take: 2,
      include: { images: { where: { isPrimary: true }, take: 1 } }
    });
  } catch (error) {
    console.warn("Database connection skipped during build");
  }

  const freeShippingThreshold = settings?.freeShippingThreshold !== null ? settings?.freeShippingThreshold : 1500;

  const megaMenuFeatures = featuredProducts.map(p => ({
    id: p.id,
    name: p.name,
    imageUrl: p.images[0]?.url || "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=2070&auto=format&fit=crop"
  }));

  return (
    <html
      lang="en"
      className={`${inter.variable} ${outfit.variable} ${roboto.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col transition-colors duration-300 dark:bg-gray-950 dark:text-gray-100" suppressHydrationWarning>
        <Providers>
          <Navbar freeShippingThreshold={freeShippingThreshold} megaMenuFeatures={megaMenuFeatures} />
          <CartDrawer />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
