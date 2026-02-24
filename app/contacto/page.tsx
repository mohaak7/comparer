export const revalidate = 3600;

export default function ContactoPage() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-10 md:px-8 md:py-14">
      <h1 className="text-3xl font-bold mb-4">Contacto</h1>
      <p className="text-muted-foreground mb-4">
        ¿Tienes alguna sugerencia, has detectado un error en los precios o quieres
        proponernos una colaboración? Nos encantará escucharte.
      </p>
      <p className="text-muted-foreground mb-4">
        Puedes ponerte en contacto con el equipo de Comparer a través de tu cliente de
        correo habitual:
      </p>
      <p className="text-muted-foreground mb-6">
        <a
          href="mailto:contacto@comparerdemo.com"
          className="underline underline-offset-2"
        >
          contacto@comparerdemo.com
        </a>
      </p>
      <p className="text-muted-foreground text-sm">
        Intentamos responder a todos los mensajes en un plazo razonable. Ten en cuenta
        que actualmente se trata de un proyecto en evolución y algunas funciones aún
        pueden estar en fase beta.
      </p>
    </main>
  );
}

