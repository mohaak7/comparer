import { notFound } from "next/navigation";
import { getProductBySlug, getPriceHistory } from "@/lib/db-queries";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PriceChart } from "@/components/product/PriceChart";
import { PriceAlertForm } from "@/components/product/PriceAlertForm";
import { ExternalLink, TrendingDown, BarChart3, ArrowLeft } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";
import { getAffiliateUrl } from "@/lib/affiliate";

export const revalidate = 3600; // ISR: 1 hour

// ── SEO Metadata ──────────────────────────────────────────────────
type PageProps = { params: Promise<{ slug: string }> };

const currentYear = new Date().getFullYear();

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;
    const product = await getProductBySlug(slug);

    if (!product) {
        return { title: "Producto no encontrado" };
    }

    const cheapest = product.prices[0];
    return {
        title: `${product.name} al mejor precio | Comparativa ${currentYear}`,
        description: `Compara precios de ${product.name} en ${product.prices.map((p) => p.store).join(", ")}. Desde ${cheapest.price.toFixed(2)}€. Ofertas actualizadas en ${currentYear}.`,
        openGraph: {
            title: `${product.name} al mejor precio | Comparativa ${currentYear}`,
            description: `Mejor precio: ${cheapest.price.toFixed(2)}€ en ${cheapest.store}. Compara ofertas de ${product.prices.length} tiendas.`,
        },
    };
}

// ── Page Component ────────────────────────────────────────────────
export default async function ProductoPage({ params }: PageProps) {
    const { slug } = await params;
    const product = await getProductBySlug(slug);

    if (!product) notFound();

    const cheapest = product.prices[0];
    const priceHistory = await getPriceHistory(product.id);
    const cheapestAffiliateUrl = getAffiliateUrl(cheapest.url);

    const stores = product.prices.map((p) => p.store);
    const hasThreeWayComparison = ["Amazon", "PCComponentes", "AliExpress"].every((s) =>
        stores.includes(s)
    );

    return (
        <main className="max-w-4xl mx-auto p-6 md:p-10">
            {/* Volver al inicio */}
            <Link
                href="/"
                className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6"
            >
                <ArrowLeft size={16} /> Volver al inicio
            </Link>

            {/* Cabecera del producto */}
            <div className="flex flex-col md:flex-row gap-8 mb-10">
                {/* Imagen */}
                <div className="w-full md:w-1/3 aspect-square rounded-xl bg-muted flex items-center justify-center text-muted-foreground text-sm border">
                    {product.image ? (
                        <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-contain rounded-xl"
                        />
                    ) : (
                        <span>Imagen no disponible</span>
                    )}
                </div>

                {/* Información del producto */}
                <div className="flex-1">
                    <p className="text-sm text-muted-foreground uppercase tracking-wide mb-1">
                        {product.brand} · {product.category}
                    </p>
                    <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
                    <div className="flex items-center gap-2 text-green-600 font-semibold mb-2">
                        <TrendingDown size={20} />
                        <span className="text-4xl">{cheapest.price.toFixed(2)}€</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                        Mejor precio en <strong>{cheapest.store}</strong>
                    </p>
                    {cheapestAffiliateUrl && (
                        <div className="mt-4">
                            <Button
                                asChild
                                className="bg-orange-600 hover:bg-orange-700"
                                size="lg"
                            >
                                <a
                                    href={cheapestAffiliateUrl}
                                    target="_blank"
                                    rel="nofollow noopener noreferrer"
                                >
                                    Ver oferta destacada{" "}
                                    <ExternalLink className="ml-2" size={16} />
                                </a>
                            </Button>
                        </div>
                    )}
                </div>
            </div>

            {/* Comparativa de Precios */}
            <Card className="mb-10">
                <CardHeader>
                    <CardTitle className="text-xl">
                        Comparativa de Precios
                        {hasThreeWayComparison && (
                            <span className="ml-2 text-xs font-normal text-muted-foreground">
                                (Amazon, PCComponentes y AliExpress)
                            </span>
                        )}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b text-sm text-muted-foreground">
                                    <th className="pb-3 font-medium">Tienda</th>
                                    <th className="pb-3 font-medium">Precio</th>
                                    <th className="pb-3 font-medium">Actualizado</th>
                                    <th className="pb-3 font-medium text-right">Enlace</th>
                                </tr>
                            </thead>
                            <tbody>
                                {product.prices.map((entry, i) => (
                                    <tr
                                        key={entry.store}
                                        className="border-b last:border-0 hover:bg-muted/50 transition-colors"
                                    >
                                        <td className="py-3 font-medium">
                                            {entry.store}
                                            {i === 0 && (
                                                <span className="ml-2 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                                                    Mejor precio
                                                </span>
                                            )}
                                        </td>
                                        <td className="py-3 text-lg font-semibold">
                                            {entry.price.toFixed(2)}€
                                        </td>
                                        <td className="py-3 text-sm text-muted-foreground">
                                            {new Date(entry.updatedAt).toLocaleDateString("es-ES", {
                                                day: "numeric",
                                                month: "short",
                                                year: "numeric",
                                            })}
                                        </td>
                                        <td className="py-3 text-right">
                                            {entry.url && (
                                                <Button
                                                    asChild
                                                    size="sm"
                                                    className="bg-orange-600 hover:bg-orange-700"
                                                >
                                                    <a
                                                        href={getAffiliateUrl(entry.url) ?? entry.url}
                                                        target="_blank"
                                                        rel="nofollow noopener noreferrer"
                                                    >
                                                        Ver oferta{" "}
                                                        <ExternalLink className="ml-1" size={14} />
                                                    </a>
                                                </Button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>

            {/* Evolución de precios */}
            <Card className="mb-8">
                <CardHeader>
                    <CardTitle className="text-xl flex items-center gap-2">
                        <BarChart3 size={20} />
                        Evolución de precios
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <PriceChart data={priceHistory} />
                </CardContent>
            </Card>

            {/* Formulario de alerta de precio */}
            <PriceAlertForm productId={product.id} />
        </main>
    );
}
