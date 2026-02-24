import Link from "next/link";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { ExternalLink, TrendingDown } from "lucide-react";
import { getAffiliateUrl } from "@/lib/affiliate";

interface ProductCardProps {
    name: string;
    price: number;
    store: string;
    url: string;
    slug: string;
    isHistoricalLow?: boolean;
    discountPercentage?: number;
}

export function ProductCard({
    name,
    price,
    store,
    url,
    slug,
    isHistoricalLow,
    discountPercentage,
}: ProductCardProps) {
    const affiliateUrl = getAffiliateUrl(url);
    const showDiscountBadge = !isHistoricalLow && (discountPercentage ?? 0) >= 10;

    return (
        <Card className="overflow-hidden hover:shadow-lg transition-shadow">
            <Link href={`/producto/${slug}`}>
                <CardHeader className="p-4">
                    <CardTitle className="text-lg font-bold truncate">{name}</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2 text-green-600 font-semibold">
                            <TrendingDown size={18} />
                            <span className="text-2xl">{price.toFixed(2)}€</span>
                            <span className="text-xs text-muted-foreground ml-auto uppercase">{store}</span>
                        </div>
                        {(isHistoricalLow || showDiscountBadge) && (
                            <span className="inline-flex items-center rounded-full bg-green-100 text-green-800 px-2 py-0.5 text-xs font-medium w-fit">
                                {isHistoricalLow
                                    ? "Mínimo histórico"
                                    : "¡Bajada de precio!"}
                            </span>
                        )}
                    </div>
                </CardContent>
            </Link>
            <CardFooter className="p-4 bg-muted/50">
                <Button asChild className="w-full bg-orange-600 hover:bg-orange-700">
                    <a
                        href={affiliateUrl ?? url}
                        target="_blank"
                        rel="nofollow noopener noreferrer"
                    >
                        Ver Oferta <ExternalLink className="ml-2" size={16} />
                    </a>
                </Button>
            </CardFooter>
        </Card>
    );
}