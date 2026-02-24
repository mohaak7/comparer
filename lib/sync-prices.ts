/**
 * Sync prices from retailers into the Neon database.
 * INSERTS new records (instead of overwriting) so PriceChart shows price evolution.
 *
 * Usage: npx tsx lib/sync-prices.ts
 * (or:   npm run sync)
 */
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { prices, alerts, products } from "../db/schema";
import { eq, and, desc, gte } from "drizzle-orm";
import { getLatestPrice, closeBrowser } from "./scraper";
import { sendPriceAlert } from "./notifications";
import { getAliExpressPrice } from "./aliexpress";

if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not set.");
}

const sql = neon(process.env.DATABASE_URL);
const db = drizzle(sql);

async function syncPrices() {
    console.log("🔄 Starting price sync...\n");

    // 1. Get the latest price entry per product+store (to avoid duplicate scrapes)
    const allEntries = await db
        .select()
        .from(prices)
        .orderBy(desc(prices.updatedAt));

    // De-duplicate to get one entry per product+store
    const seen = new Set<string>();
    const latestEntries = allEntries.filter((e) => {
        const key = `${e.productId}:${e.store}`;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
    });

    if (latestEntries.length === 0) {
        console.log("⚠️  No price entries found in the database.");
        return;
    }

    console.log(`📦 Found ${latestEntries.length} price entries to check.\n`);

    let inserted = 0;
    let unchanged = 0;
    let failed = 0;

    const queue = [...latestEntries];

    for (let index = 0; index < queue.length; index++) {
        const entry = queue[index];
        if (!entry.url) {
            console.log(`⏭️  Skipping product #${entry.productId} (${entry.store}) — no URL`);
            continue;
        }

        console.log(`\n🔍 [${index + 1}/${queue.length}] Product #${entry.productId} — ${entry.store}:`);

        try {
            const isAliExpress = entry.store.toLowerCase() === "aliexpress";
            const oldPrice = entry.price;
            const newPrice = isAliExpress
                ? await getAliExpressPrice(entry.url)
                : await getLatestPrice(entry.url, entry.store);

            if (newPrice !== null) {
                if (newPrice !== oldPrice) {
                    // INSERT a new record to preserve price history
                    await db.insert(prices).values({
                        productId: entry.productId,
                        price: newPrice,
                        store: entry.store,
                        url: entry.url,
                        updatedAt: new Date(),
                    });

                    // Notificar alertas de precio cuando el nuevo precio
                    // sea menor o igual al precio objetivo configurado.
                    try {
                        const [product] = await db
                            .select()
                            .from(products)
                            .where(eq(products.id, entry.productId));

                        const matchingAlerts = await db
                            .select()
                            .from(alerts)
                            .where(
                                and(
                                    eq(alerts.productId, entry.productId),
                                    gte(alerts.targetPrice, newPrice),
                                    eq(alerts.active, true)
                                )
                            );

                        for (const alert of matchingAlerts) {
                            if (product) {
                                await sendPriceAlert(
                                    alert.email,
                                    { name: product.name, url: entry.url },
                                    newPrice
                                );
                            }

                            // Desactivamos la alerta para no enviar correos duplicados.
                            await db
                                .update(alerts)
                                .set({ active: false })
                                .where(eq(alerts.id, alert.id));
                        }
                    } catch (err: any) {
                        console.error(
                            `  ⚠️ Error al procesar las alertas para producto #${entry.productId}:`,
                            err?.message ?? err
                        );
                    }

                    const diff = newPrice - oldPrice;
                    const arrow = diff > 0 ? "📈" : "📉";
                    const pctChange =
                        oldPrice > 0 ? ((newPrice - oldPrice) / oldPrice) * 100 : 0;
                    console.log(
                        `  ${arrow} New price recorded: ${oldPrice}€ → ${newPrice}€ (${diff >= 0 ? "+" : ""}${diff.toFixed(
                            2
                        )}€, ${pctChange >= 0 ? "+" : ""}${pctChange.toFixed(2)}%)`
                    );
                    inserted++;
                } else {
                    console.log(`  ➡️  Price unchanged: ${newPrice}€`);
                    unchanged++;
                }
            } else {
                console.log(`  ⚠️  Could not scrape — skipping (old price kept: ${entry.price}€)`);
                failed++;
            }
        } catch (error: any) {
            console.error(`  ❌ Error: ${error.message}`);
            failed++;
        }

        // Random delay between requests (2-5 seconds)
        const delay = 2000 + Math.random() * 3000;
        console.log(`  ⏳ Waiting ${(delay / 1000).toFixed(1)}s...`);
        await new Promise((r) => setTimeout(r, delay));
    }

    console.log(`\n${"═".repeat(45)}`);
    console.log(`✅ Sync complete:`);
    console.log(`   📝 ${inserted} new price records inserted`);
    console.log(`   ➡️  ${unchanged} prices unchanged`);
    console.log(`   ❌ ${failed} failed`);
    console.log(`${"═".repeat(45)}\n`);
}

syncPrices()
    .catch((err) => {
        console.error("❌ Sync failed:", err);
        process.exit(1);
    })
    .finally(async () => {
        await closeBrowser();
    });
