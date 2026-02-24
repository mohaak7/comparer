import { resend } from "./resend";

type NotifProduct = {
  name: string;
  url?: string | null;
};

export async function sendPriceAlert(
  email: string,
  product: NotifProduct,
  price: number
) {
  if (!resend) {
    console.warn(
      "RESEND_API_KEY no está configurada. No se enviará email de bajada de precio."
    );
    return;
  }

  const subject = `¡Bajada de precio! ${product.name} ahora a ${price.toFixed(
    2
  )}€`;

  // Cuerpo ultra sencillo para evitar filtros durante las pruebas
  const text = `Hola,

El producto "${product.name}" ha bajado de precio y ahora cuesta ${price.toFixed(
    2
  )}€.

Este es un email de prueba enviado desde Comparer usando Resend.`;

  const data = await resend.emails.send({
    from: "onboarding@resend.dev",
    to: email,
    subject,
    text,
  });

  console.log("Resend API Response (price alert):", JSON.stringify(data, null, 2));
}

export async function sendAlertConfirmation(
  email: string,
  product: NotifProduct,
  targetPrice: number
) {
  if (!resend) {
    console.warn(
      "RESEND_API_KEY no está configurada. No se enviará email de confirmación de alerta."
    );
    return;
  }

  const subject = `Has activado una alerta para ${product.name}`;

  const text = `Hola,

Hemos registrado tu alerta de precio para "${product.name}".

Te avisaremos cuando el precio sea igual o inferior a ${targetPrice.toFixed(
    2
  )}€.

Este es un email de prueba enviado desde Comparer usando Resend.`;

  const data = await resend.emails.send({
    from: "onboarding@resend.dev",
    to: email,
    subject,
    text,
  });

  console.log(
    "Resend API Response (alert confirmation):",
    JSON.stringify(data, null, 2)
  );
}

