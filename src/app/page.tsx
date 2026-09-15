import { HeroSection } from "@/components/home/HeroSection";
import { CategoryShowcase } from "@/components/home/CategoryShowcase";
import { BestSellers } from "@/components/home/BestSellers";
import { db } from "@/lib/db";

export default async function Home() {
  const banners = await db.banner.findMany({
    where: { isActive: true },
    orderBy: { order: 'asc' }
  });

  return (
    <div className="flex flex-col w-full">
      <HeroSection banners={banners} />
      <CategoryShowcase />
      <BestSellers />
    </div>
  );
}
