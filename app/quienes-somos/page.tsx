export const revalidate = 3600;

export default function QuienesSomosPage() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-10 md:px-8 md:py-14">
      <h1 className="text-3xl font-bold mb-4">Quiénes somos</h1>
      <p className="text-muted-foreground mb-4">
        Comparer es un proyecto creado para ayudar a los usuarios en España a tomar
        mejores decisiones de compra en tecnología y hardware. Reunimos precios de
        varias tiendas online para que puedas ver, de un vistazo, dónde está la mejor
        oferta en cada momento.
      </p>
      <p className="text-muted-foreground mb-4">
        Nuestro objetivo es ofrecer una experiencia sencilla, clara y transparente.
        No vendemos directamente los productos: te ayudamos a encontrarlos al mejor
        precio posible y te redirigimos a las tiendas oficiales.
      </p>
      <p className="text-muted-foreground">
        Trabajamos de forma continua para mejorar la calidad de los datos y añadir
        nuevas funcionalidades, como alertas de precio y comparativas históricas, para
        que siempre tengas la mejor información antes de comprar.
      </p>
    </main>
  );
}

