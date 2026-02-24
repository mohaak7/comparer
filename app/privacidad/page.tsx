export const revalidate = 3600;

export default function PrivacidadPage() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-10 md:px-8 md:py-14">
      <h1 className="text-3xl font-bold mb-4">Política de privacidad</h1>
      <p className="text-muted-foreground mb-4">
        Esta página es un placeholder de política de privacidad para Comparer. Resume
        de forma general nuestro compromiso con la protección de los datos de los
        usuarios.
      </p>
      <p className="text-muted-foreground mb-4">
        Comparer no vende datos personales a terceros. Los datos que puedas
        facilitarnos, como tu dirección de correo electrónico para alertas de precio,
        se utilizan únicamente para prestarte el servicio solicitado.
      </p>
      <p className="text-muted-foreground text-sm">
        En futuras iteraciones se añadirá una política de privacidad completa que
        detalle el tratamiento de datos, la base legal, los derechos de los usuarios y
        la relación con servicios externos como proveedores de email o bases de datos.
      </p>
    </main>
  );
}

