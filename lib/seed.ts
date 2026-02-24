import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { products, prices } from "@/db/schema";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set.");
}

const sql = neon(process.env.DATABASE_URL);
const db = drizzle(sql);

async function seed() {
  console.log("🌱 Seeding database with demo products...\n");

  const insertedProducts = await db
    .insert(products)
    .values([
      // GPUs
      {
        name: "NVIDIA GeForce RTX 4070 12GB",
        slug: "nvidia-geforce-rtx-4070-12gb",
        category: "GPU",
        brand: "NVIDIA",
        image: "https://placehold.co/400x300?text=RTX+4070",
      },
      {
        name: "NVIDIA GeForce RTX 4060 Ti 8GB",
        slug: "nvidia-geforce-rtx-4060-ti-8gb",
        category: "GPU",
        brand: "NVIDIA",
        image: "https://placehold.co/400x300?text=RTX+4060+Ti",
      },
      {
        name: "AMD Radeon RX 7800 XT 16GB",
        slug: "amd-radeon-rx-7800-xt-16gb",
        category: "GPU",
        brand: "AMD",
        image: "https://placehold.co/400x300?text=RX+7800+XT",
      },
      // CPUs
      {
        name: "AMD Ryzen 7 7800X3D",
        slug: "amd-ryzen-7-7800x3d",
        category: "CPU",
        brand: "AMD",
        image: "https://placehold.co/400x300?text=Ryzen+7+7800X3D",
      },
      {
        name: "Intel Core i7-14700K",
        slug: "intel-core-i7-14700k",
        category: "CPU",
        brand: "Intel",
        image: "https://placehold.co/400x300?text=i7+14700K",
      },
      {
        name: "AMD Ryzen 5 7600",
        slug: "amd-ryzen-5-7600",
        category: "CPU",
        brand: "AMD",
        image: "https://placehold.co/400x300?text=Ryzen+5+7600",
      },
      // SSDs
      {
        name: "Samsung 980 Pro 1TB PCIe 4.0 NVMe",
        slug: "samsung-980-pro-1tb-pcie-4-nvme",
        category: "SSD",
        brand: "Samsung",
        image: "https://placehold.co/400x300?text=Samsung+980+Pro+1TB",
      },
      {
        name: "WD Black SN850X 1TB PCIe 4.0 NVMe",
        slug: "wd-black-sn850x-1tb-pcie-4-nvme",
        category: "SSD",
        brand: "Western Digital",
        image: "https://placehold.co/400x300?text=WD+Black+SN850X+1TB",
      },
      {
        name: "Crucial P3 Plus 1TB PCIe 4.0 NVMe",
        slug: "crucial-p3-plus-1tb-pcie-4-nvme",
        category: "SSD",
        brand: "Crucial",
        image: "https://placehold.co/400x300?text=Crucial+P3+Plus+1TB",
      },
      // Mice
      {
        name: "Logitech G Pro X Superlight",
        slug: "logitech-g-pro-x-superlight",
        category: "Mouse",
        brand: "Logitech",
        image: "https://placehold.co/400x300?text=Logitech+G+Pro+X",
      },
      {
        name: "Logitech G502 Hero",
        slug: "logitech-g502-hero",
        category: "Mouse",
        brand: "Logitech",
        image: "https://placehold.co/400x300?text=Logitech+G502+Hero",
      },
      // Keyboards
      {
        name: "Keychron K2 Teclado Mecánico",
        slug: "keychron-k2-teclado-mecanico",
        category: "Teclado",
        brand: "Keychron",
        image: "https://placehold.co/400x300?text=Keychron+K2",
      },
      {
        name: "Corsair K70 RGB PRO",
        slug: "corsair-k70-rgb-pro",
        category: "Teclado",
        brand: "Corsair",
        image: "https://placehold.co/400x300?text=Corsair+K70+RGB+PRO",
      },
      // Monitors
      {
        name: "LG 27GP850-B 27\" QHD 165Hz",
        slug: "lg-27gp850-b-27-qhd-165hz",
        category: "Monitor",
        brand: "LG",
        image: "https://placehold.co/400x300?text=LG+27GP850",
      },
      {
        name: "Samsung Odyssey G5 32\" QHD 144Hz",
        slug: "samsung-odyssey-g5-32-qhd-144hz",
        category: "Monitor",
        brand: "Samsung",
        image: "https://placehold.co/400x300?text=Odyssey+G5+32",
      },
    ])
    .returning();

  console.log(`✅ Inserted ${insertedProducts.length} products.`);

  const ps = insertedProducts;

  await db.insert(prices).values([
    // RTX 4070
    {
      productId: ps[0].id,
      price: 639.0,
      store: "PCComponentes",
      url: "https://www.pccomponentes.com/gigabyte-geforce-rtx-4070-windforce-oc-12gb-gddr6x",
    },
    {
      productId: ps[0].id,
      price: 649.99,
      store: "Amazon",
      url: "https://www.amazon.es/dp/B0C1HG1HN8",
    },
    // RTX 4060 Ti
    {
      productId: ps[1].id,
      price: 449.0,
      store: "PCComponentes",
      url: "https://www.pccomponentes.com/msi-geforce-rtx-4060-ti-gaming-x-8g-gddr6",
    },
    {
      productId: ps[1].id,
      price: 459.99,
      store: "Amazon",
      url: "https://www.amazon.es/dp/B0C5W6C4V3",
    },
    // RX 7800 XT
    {
      productId: ps[2].id,
      price: 599.0,
      store: "PCComponentes",
      url: "https://www.pccomponentes.com/sapphire-pulse-radeon-rx-7800-xt-16-gb-gddr6",
    },
    {
      productId: ps[2].id,
      price: 609.99,
      store: "Amazon",
      url: "https://www.amazon.es/dp/B0CGPPN2K7",
    },
    // Ryzen 7 7800X3D
    {
      productId: ps[3].id,
      price: 399.0,
      store: "PCComponentes",
      url: "https://www.pccomponentes.com/amd-ryzen-7-7800x3d-45-ghz",
    },
    {
      productId: ps[3].id,
      price: 409.0,
      store: "Amazon",
      url: "https://www.amazon.es/dp/B0BY3LLLJJ",
    },
    // Intel i7-14700K
    {
      productId: ps[4].id,
      price: 469.0,
      store: "PCComponentes",
      url: "https://www.pccomponentes.com/intel-core-i7-14700k-54-ghz",
    },
    {
      productId: ps[4].id,
      price: 479.0,
      store: "Amazon",
      url: "https://www.amazon.es/dp/B0CHX1WTTG",
    },
    // Ryzen 5 7600
    {
      productId: ps[5].id,
      price: 219.0,
      store: "PCComponentes",
      url: "https://www.pccomponentes.com/amd-ryzen-5-7600-38-ghz",
    },
    {
      productId: ps[5].id,
      price: 229.0,
      store: "Amazon",
      url: "https://www.amazon.es/dp/B0BBJDS62N",
    },
    // Samsung 980 Pro 1TB
    {
      productId: ps[6].id,
      price: 109.0,
      store: "PCComponentes",
      url: "https://www.pccomponentes.com/samsung-980-pro-1tb-ssd-pcie-40-nvme-m2",
    },
    {
      productId: ps[6].id,
      price: 115.0,
      store: "Amazon",
      url: "https://www.amazon.es/dp/B08RK2SR23",
    },
    // WD Black SN850X 1TB
    {
      productId: ps[7].id,
      price: 129.0,
      store: "PCComponentes",
      url: "https://www.pccomponentes.com/wd-black-sn850x-1tb-ssd-pcie-40-nvme-m2",
    },
    {
      productId: ps[7].id,
      price: 135.0,
      store: "Amazon",
      url: "https://www.amazon.es/dp/B0B5HHXF8X",
    },
    // Crucial P3 Plus 1TB
    {
      productId: ps[8].id,
      price: 79.0,
      store: "PCComponentes",
      url: "https://www.pccomponentes.com/crucial-p3-plus-1tb-ssd-pcie-40-nvme-m2",
    },
    {
      productId: ps[8].id,
      price: 82.0,
      store: "Amazon",
      url: "https://www.amazon.es/dp/B0B5B9ZL5N",
    },
    // Logitech G Pro X Superlight
    {
      productId: ps[9].id,
      price: 139.0,
      store: "PCComponentes",
      url: "https://www.pccomponentes.com/logitech-g-pro-x-superlight-raton-gaming-25600-dpi-blanco",
    },
    {
      productId: ps[9].id,
      price: 149.0,
      store: "Amazon",
      url: "https://www.amazon.es/dp/B08YKG5K7Y",
    },
    // Logitech G502 Hero
    {
      productId: ps[10].id,
      price: 49.99,
      store: "PCComponentes",
      url: "https://www.pccomponentes.com/logitech-g502-hero-raton-gaming-16000-dpi",
    },
    {
      productId: ps[10].id,
      price: 54.99,
      store: "Amazon",
      url: "https://www.amazon.es/dp/B07GS6ZB7T",
    },
    // Keychron K2
    {
      productId: ps[11].id,
      price: 89.0,
      store: "PCComponentes",
      url: "https://www.pccomponentes.com/keychron-k2-v2-teclado-mecanico-wireless-brown-switch-ingles",
    },
    {
      productId: ps[11].id,
      price: 95.0,
      store: "Amazon",
      url: "https://www.amazon.es/dp/B08J7TLPQL",
    },
    // Corsair K70 RGB PRO
    {
      productId: ps[12].id,
      price: 159.0,
      store: "PCComponentes",
      url: "https://www.pccomponentes.com/corsair-k70-rgb-pro-mecanico-cherry-mx-red",
    },
    {
      productId: ps[12].id,
      price: 169.0,
      store: "Amazon",
      url: "https://www.amazon.es/dp/B09V7ZJZ3H",
    },
    // LG 27GP850-B
    {
      productId: ps[13].id,
      price: 349.0,
      store: "PCComponentes",
      url: "https://www.pccomponentes.com/lg-27gp850-b-27-led-nanoips-qhd-165hz-g-sync-compatible",
    },
    {
      productId: ps[13].id,
      price: 359.0,
      store: "Amazon",
      url: "https://www.amazon.es/dp/B094P2SSQF",
    },
    // Samsung Odyssey G5 32"
    {
      productId: ps[14].id,
      price: 329.0,
      store: "PCComponentes",
      url: "https://www.pccomponentes.com/samsung-odyssey-g5-lc32g55tqbuxen-32-led-quad-hd-144hz-freesync-premium",
    },
    {
      productId: ps[14].id,
      price: 339.0,
      store: "Amazon",
      url: "https://www.amazon.es/dp/B08ZYG1M3P",
    },
  ]);

  console.log("✅ Seeded prices for all demo products.");
  console.log("🎉 Seeding complete.");
}

seed().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});

