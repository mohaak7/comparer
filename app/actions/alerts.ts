"use server";

import { db } from "@/db";
import { alerts, products } from "@/db/schema";
import { eq } from "drizzle-orm";
import { sendAlertConfirmation } from "@/lib/notifications";

type AlertFormState = {
  success: boolean;
  message: string;
  fieldErrors?: {
    email?: string;
    targetPrice?: string;
  };
};

export async function createPriceAlert(
  prevState: AlertFormState | null,
  formData: FormData
): Promise<AlertFormState> {
  const email = (formData.get("email") || "").toString().trim();
  const productId = Number(formData.get("productId"));
  const targetPriceRaw = (formData.get("targetPrice") || "").toString().trim();

  const fieldErrors: AlertFormState["fieldErrors"] = {};

  if (!email) {
    fieldErrors.email = "El email es obligatorio.";
  } else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    fieldErrors.email = "Introduce un email válido.";
  }

  const targetPrice = Number(targetPriceRaw.replace(",", "."));
  if (!targetPriceRaw) {
    fieldErrors.targetPrice = "El precio deseado es obligatorio.";
  } else if (Number.isNaN(targetPrice) || targetPrice <= 0) {
    fieldErrors.targetPrice = "Introduce un precio válido mayor que 0.";
  }

  if (!productId || Number.isNaN(productId)) {
    return {
      success: false,
      message: "Producto no válido.",
      fieldErrors,
    };
  }

  if (fieldErrors.email || fieldErrors.targetPrice) {
    return {
      success: false,
      message: "Por favor, corrige los errores.",
      fieldErrors,
    };
  }

  await db.insert(alerts).values({
    email,
    productId,
    targetPrice,
    active: true,
  });

  try {
    const [product] = await db
      .select()
      .from(products)
      .where(eq(products.id, productId));

    if (product) {
      await sendAlertConfirmation(
        email,
        { name: product.name },
        targetPrice
      );
    }
  } catch (err: any) {
    console.error(
      "Error al enviar email de confirmación de alerta:",
      err?.message ?? err
    );
  }

  return {
    success: true,
    message: "¡Éxito! Te avisaremos cuando el precio baje.",
  };
}

