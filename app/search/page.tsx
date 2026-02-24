import { ProductCard } from "@/components/product/ProductCard";
import { searchProducts } from "@/lib/db-queries";

type SearchPageProps = {
  searchParams?: {
    q?: string;
  };
};

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const q = searchParams?.q?.toString() ?? "";
  const results = q ? await searchProducts(q) : [];

  return (
    <main className="max-w-6xl mx-auto px-6 py-10 md:px-12 md:py-14">
      <h1 className="text-2xl md:text-3xl font-bold mb-4">Buscar productos</h1>
      <p className="text-sm text-muted-foreground mb-6">
        Introduce el nombre del componente o una categoría (por ejemplo, &quot;GPU&quot;,
        &quot;CPU&quot;, &quot;SSD&quot;) para encontrar resultados relevantes.
      </p>

      <form
        action="/search"
        className="mb-8 w-full max-w-xl flex items-center gap-2 rounded-full border bg-background px-4 py-2 shadow-sm"
      >
        <input
          type="text"
          name="q"
          defaultValue={q}
          placeholder="Buscar por nombre o categoría"
          className="flex-1 bg-transparent outline-none text-sm md:text-base"
        />
        <button
          type="submit"
          className="text-xs md:text-sm font-medium px-3 py-1.5 rounded-full bg-primary text-primary-foreground"
        >
          Buscar
        </button>
      </form>

      {q && (
        <p className="text-sm text-muted-foreground mb-4">
          Resultados para <span className="font-semibold">&quot;{q}&quot;</span>
          {results.length > 0 ? ` (${results.length})` : " — no se han encontrado productos."}
        </p>
      )}

      {results.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {results.map((product) => (
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
      )}

      {!q && (
        <p className="text-sm text-muted-foreground">
          Empieza escribiendo algo en el buscador para ver coincidencias.
        </p>
      )}
    </main>
  );
}

