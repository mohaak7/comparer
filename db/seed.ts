import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { products, prices } from "./schema";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not set.");
}

const sql = neon(process.env.DATABASE_URL);
const db = drizzle(sql);

async function seed() {
    console.log("🌱 Seeding database...\n");

    // ── Insert products ────────────────────────────────────────────
    const insertedProducts = await db
        .insert(products)
        .values([
            {
                name: "MSI GeForce RTX 4060 Ventus 2X Black OC 8GB GDDR6",
                slug: "msi-geforce-rtx-4060-ventus-2x-black-oc-8gb-gddr6",
                category: "Tarjetas Gráficas",
                brand: "MSI",
                image: "https://placehold.co/400x300?text=RTX+4060",
            },
            {
                name: "Samsung 980 SSD 1TB PCIe 3.0 NVMe M.2",
                slug: "samsung-980-ssd-1tb-pcie-30-nvme-m2",
                category: "SSD",
                brand: "Samsung",
                image: "https://placehold.co/400x300?text=Samsung+980+1TB",
            },
            {
                name: "Logitech G502 Hero Ratón Gaming 16000 DPI",
                slug: "logitech-g502-hero-raton-gaming-16000-dpi",
                category: "Ratones",
                brand: "Logitech",
                image: "https://placehold.co/400x300?text=Logitech+G502+Hero",
            },
        ])
        .returning();

    console.log(`✅ Inserted ${insertedProducts.length} products:`);
    for (const p of insertedProducts) {
        console.log(`   - [${p.id}] ${p.name}`);
    }

    // ── Insert prices ─────────────────────────────────────────────
    const insertedPrices = await db
        .insert(prices)
        .values([
            {
                productId: insertedProducts[0].id,
                price: 329.9,
                store: "PCComponentes",
                url: "https://www.pccomponentes.com/msi-geforce-rtx-4060-ventus-2x-black-oc-8gb-gddr6",
            },
            {
                productId: insertedProducts[1].id,
                price: 89.0,
                store: "PCComponentes",
                url: "https://www.pccomponentes.com/samsung-980-ssd-1tb-pcie-30-nvme-m2",
            },
            {
                productId: insertedProducts[2].id,
                price: 49.99,
                store: "PCComponentes",
                url: "https://www.pccomponentes.com/logitech-g502-hero-raton-gaming-16000-dpi",
            },
            {
                productId: insertedProducts[2].id,
                price: 44.99,
                store: "AliExpress",
                url: "https://www.aliexpress.com/item/1005005327020547.html",
            },
        ])
        .returning();

    console.log(`\n✅ Inserted ${insertedPrices.length} prices:`);
    for (const p of insertedPrices) {
        console.log(`   - [Product #${p.productId}] ${p.store}: ${p.price}€`);
    }

    console.log("\n🎉 Seeding complete!");
}

seed().catch((err) => {
    console.error("❌ Seed failed:", err);
    process.exit(1);
});
