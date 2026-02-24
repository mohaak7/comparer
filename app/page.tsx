import { ProductCard } from "@/components/product/ProductCard";
import { getProductsWithPrices, getTopDeals } from "@/lib/db-queries";
import { Cpu, HardDrive, Monitor } from "lucide-react";

export const revalidate = 3600; // ISR: refresh data every hour

export default async function Home() {
  const [products, topDeals] = await Promise.all([
    getProductsWithPrices(),
    getTopDeals(),
  ]);

  const latestProducts = products.slice(0, 4);

  return (
    <main className="px-6 py-10 md:px-12 md:py-14 max-w-6xl mx-auto">
      {/* Hero */}
      <section className="mb-10 md:mb-14 text-center">
        <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
          Encuentra el mejor precio para tu próximo PC
        </h1>
        <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
          Compara tarjetas gráficas, procesadores y almacenamiento en las principales
          tiendas online y toma decisiones de compra con datos en tiempo real.
        </p>

        {/* Search bar (UI placeholder) */}
        <div className="w-full max-w-xl mx-auto">
          <div className="flex items-center gap-2 rounded-full border bg-background px-4 py-2 shadow-sm">
            <input
              type="text"
              placeholder="Buscar componente o producto (próximamente)"
              className="flex-1 bg-transparent outline-none text-sm md:text-base"
            />
            <button
              type="button"
              className="text-xs md:text-sm font-medium px-3 py-1.5 rounded-full bg-primary text-primary-foreground opacity-70 cursor-default"
            >
              Buscar
            </button>
          </div>
        </div>
      </section>

      {/* Categories grid */}
      <section className="mb-10 md:mb-12">
        <h2 className="text-xl md:text-2xl font-semibold mb-4">Categorías destacadas</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
          <div className="rounded-xl border bg-card p-4 flex flex-col gap-2">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <Monitor className="w-4 h-4 text-primary" />
              Tarjetas gráficas
            </div>
            <p className="text-xs text-muted-foreground">
              Encuentra la mejor GPU para gaming y creación de contenido.
            </p>
          </div>
          <div className="rounded-xl border bg-card p-4 flex flex-col gap-2">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <Cpu className="w-4 h-4 text-primary" />
              Procesadores
            </div>
            <p className="text-xs text-muted-foreground">
              Compara CPUs de última generación para tu próximo PC.
            </p>
          </div>
          <div className="rounded-xl border bg-card p-4 flex flex-col gap-2">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <HardDrive className="w-4 h-4 text-primary" />
              Almacenamiento
            </div>
            <p className="text-xs text-muted-foreground">
              SSDs NVMe y discos duros al mejor precio por gigabyte.
            </p>
          </div>
        </div>
      </section>

      {topDeals.length > 0 && (
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-3">Bajadas de precio</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Productos con descuentos destacados respecto a su precio medio histórico.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {topDeals.map((deal) => (
              <ProductCard
                key={`deal-${deal.id}`}
                name={deal.name}
                price={deal.price}
                store={deal.store}
                url={deal.url ?? "#"}
                slug={deal.slug}
                isHistoricalLow={deal.isHistoricalLow}
                discountPercentage={deal.discountPercentage}
              />
            ))}
          </div>
        </section>
      )}

      <section>
        <h2 className="text-2xl font-semibold mb-3">Últimos productos añadidos</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Una selección rápida de componentes recién añadidos a Comparer.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {latestProducts.map((product) => (
            <ProductCard
              key={product.id}
              name={product.name}
              price={product.price}
              store={product.store}
              url={product.url ?? "#"}
              slug={product.slug}
            />
          ))}
        </div>
      </section>
    </main>
  );
}