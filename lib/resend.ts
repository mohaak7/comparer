import { Resend } from "resend";

if (!process.env.RESEND_API_KEY) {
  console.warn("⚠️ RESEND_API_KEY no está configurada. No se enviarán emails.");
}

export const resend =
  process.env.RESEND_API_KEY != null
    ? new Resend(process.env.RESEND_API_KEY)
    : null;

