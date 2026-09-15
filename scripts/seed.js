const { PrismaClient } = require('@prisma/client');
const { PrismaBetterSqlite3 } = require('@prisma/adapter-better-sqlite3');
const adapter = new PrismaBetterSqlite3({ url: "file:./dev.db" });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Seeding the database with real world-class data...');

  // 1. Create Categories
  const catMen = await prisma.category.upsert({
    where: { slug: 'men' },
    update: {},
    create: {
      name: 'Men',
      slug: 'men',
      description: "Premium men's apparel."
    },
  });

  const catLadies = await prisma.category.upsert({
    where: { slug: 'ladies' },
    update: {},
    create: {
      name: 'Ladies',
      slug: 'ladies',
      description: "Elegant women's wear."
    },
  });

  const catKids = await prisma.category.upsert({
    where: { slug: 'kids' },
    update: {},
    create: {
      name: 'Kids',
      slug: 'kids',
      description: "Comfortable kids clothing."
    },
  });

  // 2. Create Products
  const products = [
    {
      categoryId: catMen.id,
      name: 'Essential Oversized Tee',
      slug: 'essential-oversized-tee-black',
      sku: 'MEN-TEE-BLK-01',
      description: 'Crafted from 100% premium heavyweight cotton. Features a relaxed, dropped-shoulder fit. The perfect daily essential.',
      basePrice: 1200,
      isActive: true,
      images: {
        create: [
          { url: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=1974&auto=format&fit=crop', isPrimary: true, order: 0 },
          { url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=2080&auto=format&fit=crop', isPrimary: false, order: 1 }
        ]
      },
      attributes: {
        create: [
          { name: 'Material', value: '100% Heavyweight Cotton' },
          { name: 'Fit', value: 'Oversized' },
          { name: 'Care', value: 'Machine wash cold' }
        ]
      }
    },
    {
      categoryId: catMen.id,
      name: 'Classic Linen Polo',
      slug: 'classic-linen-polo-white',
      sku: 'MEN-POLO-WHT-01',
      description: 'Breathable, lightweight linen polo shirt. Tailored for a modern, slim fit. Ideal for warm weather.',
      basePrice: 1850,
      isActive: true,
      images: {
        create: [
          { url: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=1976&auto=format&fit=crop', isPrimary: true, order: 0 }
        ]
      },
      attributes: {
        create: [
          { name: 'Material', value: '100% Linen' },
          { name: 'Fit', value: 'Slim' }
        ]
      }
    },
    {
      categoryId: catLadies.id,
      name: 'Ribbed Knit Cardigan',
      slug: 'ribbed-knit-cardigan-beige',
      sku: 'LDS-KNT-BGE-01',
      description: 'Soft, textured ribbed knit cardigan with oversized buttons. A versatile layering piece for any season.',
      basePrice: 2200,
      isActive: true,
      images: {
        create: [
          { url: 'https://images.unsplash.com/photo-1620799140188-3b2a02fd9a77?q=80&w=1972&auto=format&fit=crop', isPrimary: true, order: 0 }
        ]
      }
    },
    {
      categoryId: catLadies.id,
      name: 'Silk Camisole Top',
      slug: 'silk-camisole-top-black',
      sku: 'LDS-SLK-BLK-01',
      description: 'Luxurious 100% silk camisole. Features delicate straps and a cowl neckline for an effortlessly elegant look.',
      basePrice: 1500,
      isActive: true,
      images: {
        create: [
          { url: 'https://images.unsplash.com/photo-1503342394128-c104d54dba01?q=80&w=1974&auto=format&fit=crop', isPrimary: true, order: 0 }
        ]
      }
    },
    {
      categoryId: catKids.id,
      name: 'Cotton Play Set',
      slug: 'cotton-play-set-blue',
      sku: 'KDS-SET-BLU-01',
      description: 'Two-piece matching set made from ultra-soft, breathable organic cotton. Designed for all-day comfort.',
      basePrice: 950,
      isActive: true,
      images: {
        create: [
          { url: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?q=80&w=2070&auto=format&fit=crop', isPrimary: true, order: 0 }
        ]
      }
    }
  ];

  for (const product of products) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: {},
      create: product,
    });
  }

  console.log('Database seeding completed successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
