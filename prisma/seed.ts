import "dotenv/config";
import { db } from "../src/lib/db";
import bcrypt from "bcryptjs";

async function main() {
  console.log("Seeding database...");

  // 1. Create Admin Role & User
  const adminRole = await db.role.upsert({
    where: { name: 'Admin' },
    update: {},
    create: { name: 'Admin', description: 'Administrator with full access' },
  });

  const hashedAdminPassword = await bcrypt.hash('admin123', 10);
  await db.user.upsert({
    where: { email: 'admin@faithhubbd.com' },
    update: {},
    create: {
      email: 'admin@faithhubbd.com',
      firstName: 'System',
      lastName: 'Admin',
      passwordHash: hashedAdminPassword,
      roleId: adminRole.id,
      isActive: true,
    },
  });

  // 2. Create Categories
  const menCategory = await db.category.upsert({
    where: { slug: 'men' },
    update: {},
    create: { name: 'Men', slug: 'men', description: "Men's Collection" },
  });

  const ladiesCategory = await db.category.upsert({
    where: { slug: 'ladies' },
    update: {},
    create: { name: 'Ladies', slug: 'ladies', description: "Ladies' Collection" },
  });

  const kidsCategory = await db.category.upsert({
    where: { slug: 'kids' },
    update: {},
    create: { name: 'Kids', slug: 'kids', description: "Kids' Collection" },
  });

  const categories = [menCategory, ladiesCategory, kidsCategory];
  
  // 3. Generate 50 Dummy Products
  const products = [];
  const adjectives = ["Premium", "Classic", "Modern", "Vintage", "Essential", "Luxury", "Casual", "Sporty", "Elegant"];
  const nouns = ["T-Shirt", "Hoodie", "Jeans", "Jacket", "Sneakers", "Polo", "Sweater", "Joggers", "Dress", "Shorts"];
  
  for (let i = 1; i <= 50; i++) {
    const category = categories[Math.floor(Math.random() * categories.length)];
    const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
    const noun = nouns[Math.floor(Math.random() * nouns.length)];
    
    const name = `${adjective} ${noun} ${i}`;
    const slug = `${adjective.toLowerCase()}-${noun.toLowerCase()}-${i}`;
    const basePrice = Math.floor(Math.random() * 2000) + 500; // Between 500 and 2500
    
    products.push({
      name,
      slug,
      description: `High quality ${name.toLowerCase()} perfect for everyday wear. Made with premium materials.`,
      basePrice,
      sku: `SKU-${category.name.substring(0,3).toUpperCase()}-${i.toString().padStart(3, '0')}`,
      categoryId: category.id,
      imageUrl: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=2070&auto=format&fit=crop" // Generic clothing image
    });
  }

  for (const p of products) {
    const imageUrl = p.imageUrl;
    const { imageUrl: _, ...rest } = p;
    
    const product = await db.product.upsert({
      where: { sku: p.sku },
      update: rest,
      create: rest,
    });

    // Add image
    const imagesCount = await db.productImage.count({ where: { productId: product.id } });
    if (imagesCount === 0) {
      await db.productImage.create({
        data: {
          productId: product.id,
          url: imageUrl,
          isPrimary: true
        }
      });
    }
    
    // Add inventory
    const invCount = await db.inventory.count({ where: { productId: product.id } });
    if (invCount === 0) {
      await db.inventory.create({
        data: {
          productId: product.id,
          quantity: 100, // 100 items in stock for each dummy product
        }
      });
    }
  }

  console.log("Database seeded successfully with 50 products!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
