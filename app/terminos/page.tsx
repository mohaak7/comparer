export const revalidate = 3600;

export default function TerminosPage() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-10 md:px-8 md:py-14">
      <h1 className="text-3xl font-bold mb-4">Términos de servicio</h1>
      <p className="text-muted-foreground mb-4">
        Esta página actúa como un placeholder de términos de servicio para Comparer.
        El objetivo es informar de que se trata de un comparador de precios que no
        vende directamente ningún producto.
      </p>
      <p className="text-muted-foreground mb-4">
        El contenido, precios y disponibilidad de los productos mostrados pueden
        cambiar en cualquier momento sin previo aviso. Siempre debes revisar la
        información final en la tienda de destino antes de completar una compra.
      </p>
      <p className="text-muted-foreground text-sm">
        Próximamente se añadirá una versión completa y detallada de estos términos de
        servicio para su revisión por parte de los usuarios y de los programas de
        afiliados.
      </p>
    </main>
  );
}

