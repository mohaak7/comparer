import { db } from "@/db";
import { products, prices } from "@/db/schema";
import { eq, asc } from "drizzle-orm";

export type ProductWithPrice = {
    id: number;
    name: string;
    slug: string;
    category: string | null;
    brand: string | null;
    image: string | null;
    price: number;
    store: string;
    url: string | null;
};

export type DealProduct = ProductWithPrice & {
    discountPercentage: number;
    isHistoricalLow: boolean;
};

/**
 * Fetch every product together with its cheapest current price.
 * Returns one row per product (the store with the lowest price wins).
 */
export async function getProductsWithPrices(): Promise<ProductWithPrice[]> {
    const rows = await db
        .select({
            id: products.id,
            name: products.name,
            slug: products.slug,
            category: products.category,
            brand: products.brand,
            image: products.image,
            price: prices.price,
            store: prices.store,
            url: prices.url,
            updatedAt: prices.updatedAt,
        })
        .from(products)
        .innerJoin(prices, eq(prices.productId, products.id))
        .orderBy(asc(prices.price));

    // De-duplicate: keep only the cheapest price per product
    const seen = new Set<number>();
    const result: ProductWithPrice[] = [];

    for (const row of rows) {
        if (!seen.has(row.id)) {
            seen.add(row.id);
            result.push({
                id: row.id,
                name: row.name,
                slug: row.slug,
                category: row.category,
                brand: row.brand,
                image: row.image,
                price: row.price,
                store: row.store,
                url: row.url,
            });
        }
    }

    return result;
}

/**
 * Devuelve productos cuya oferta actual es al menos un 10% más barata
 * que su precio medio histórico.
 */
export async function getTopDeals(): Promise<DealProduct[]> {
    const productsWithPrice = await getProductsWithPrices();
    const deals: DealProduct[] = [];

    for (const product of productsWithPrice) {
        const history = await getPriceHistory(product.id);
        if (history.length === 0) continue;

        const pricesOnly = history.map((p) => p.price);
        const avgPrice =
            pricesOnly.reduce((sum, value) => sum + value, 0) / pricesOnly.length;
        const minPrice = Math.min(...pricesOnly);
        const current = product.price;

        if (current <= avgPrice * 0.9) {
            const discountPercentage = ((avgPrice - current) / avgPrice) * 100;
            const isHistoricalLow = current <= minPrice + 1e-6;

            deals.push({
                ...product,
                discountPercentage,
                isHistoricalLow,
            });
        }
    }

    // Ordenar de mayor a menor descuento
    deals.sort((a, b) => b.discountPercentage - a.discountPercentage);

    return deals;
}

// ── Single product with ALL prices (for detail page) ────────────

export type PriceEntry = {
    store: string;
    price: number;
    url: string | null;
    updatedAt: Date;
};

export type ProductWithAllPrices = {
    id: number;
    name: string;
    slug: string;
    category: string | null;
    brand: string | null;
    image: string | null;
    prices: PriceEntry[];
};

/**
 * Fetch a single product by slug with all its store prices.
 */
export async function getProductBySlug(
    slug: string
): Promise<ProductWithAllPrices | null> {
    const rows = await db
        .select({
            id: products.id,
            name: products.name,
            slug: products.slug,
            category: products.category,
            brand: products.brand,
            image: products.image,
            price: prices.price,
            store: prices.store,
            url: prices.url,
            updatedAt: prices.updatedAt,
        })
        .from(products)
        .innerJoin(prices, eq(prices.productId, products.id))
        .where(eq(products.slug, slug))
        .orderBy(asc(prices.price));

    if (rows.length === 0) return null;

    const first = rows[0];
    return {
        id: first.id,
        name: first.name,
        slug: first.slug,
        category: first.category,
        brand: first.brand,
        image: first.image,
        prices: rows.map((r) => ({
            store: r.store,
            price: r.price,
            url: r.url,
            updatedAt: r.updatedAt,
        })),
    };
}

// ── Price history for chart ─────────────────────────────────────

export type PriceHistoryPoint = {
    date: string; // ISO string for serialisation
    price: number;
    store: string;
};

/**
 * Fetch all price entries for a product, ordered by date ascending.
 * Returns data ready for a LineChart.
 */
export async function getPriceHistory(
    productId: number
): Promise<PriceHistoryPoint[]> {
    const rows = await db
        .select({
            price: prices.price,
            store: prices.store,
            updatedAt: prices.updatedAt,
        })
        .from(prices)
        .where(eq(prices.productId, productId))
        .orderBy(asc(prices.updatedAt));

    return rows.map((r) => ({
        date: r.updatedAt.toISOString(),
        price: r.price,
        store: r.store,
    }));
}
