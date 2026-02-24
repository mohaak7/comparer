import type { MetadataRoute } from "next";
import { db } from "@/db";
import { products } from "@/db/schema";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://comparer-demo.example";

  const staticRoutes: MetadataRoute.Sitemap = [
    "",
    "/quienes-somos",
    "/contacto",
    "/terminos",
    "/privacidad",
  ].map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
  }));

  const productRows = await db.select({ slug: products.slug }).from(products);

  const productRoutes: MetadataRoute.Sitemap = productRows.map((p) => ({
    url: `${baseUrl}/producto/${p.slug}`,
    lastModified: new Date(),
  }));

  return [...staticRoutes, ...productRoutes];
}

