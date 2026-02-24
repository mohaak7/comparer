import {
    pgTable,
    serial,
    text,
    integer,
    doublePrecision,
    timestamp,
    uniqueIndex,
    boolean,
} from "drizzle-orm/pg-core";

// ── Products ────────────────────────────────────────────────────
export const products = pgTable(
    "products",
    {
        id: serial("id").primaryKey(),
        name: text("name").notNull(),
        slug: text("slug").notNull(),
        category: text("category"),
        brand: text("brand"),
        image: text("image"),
    },
    (table) => [uniqueIndex("products_slug_idx").on(table.slug)]
);

// ── Prices ──────────────────────────────────────────────────────
export const prices = pgTable("prices", {
    id: serial("id").primaryKey(),
    productId: integer("product_id")
        .notNull()
        .references(() => products.id, { onDelete: "cascade" }),
    price: doublePrecision("price").notNull(),
    store: text("store").notNull(), // e.g. 'Amazon', 'PCComponentes'
    url: text("url"), // affiliate link
    updatedAt: timestamp("updated_at", { withTimezone: true })
        .defaultNow()
        .notNull(),
});

// ── Alerts ──────────────────────────────────────────────────────
export const alerts = pgTable("alerts", {
    id: serial("id").primaryKey(),
    email: text("email").notNull(),
    productId: integer("product_id")
        .notNull()
        .references(() => products.id, { onDelete: "cascade" }),
    targetPrice: doublePrecision("target_price").notNull(),
    active: boolean("active").notNull().default(true),
});

// ── Type helpers (infer Insert / Select types) ──────────────────
export type Product = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;

export type Price = typeof prices.$inferSelect;
export type NewPrice = typeof prices.$inferInsert;

export type Alert = typeof alerts.$inferSelect;
export type NewAlert = typeof alerts.$inferInsert;
