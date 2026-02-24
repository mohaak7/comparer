const ALIEXPRESS_APP_KEY = process.env.ALIEXPRESS_APP_KEY;

function extractProductId(input: string): string | null {
  try {
    const url = new URL(input);
    const match = url.pathname.match(/item\/(\d+)\.html/i);
    if (match) return match[1];
  } catch {
    // Not a URL, maybe already an ID
    if (/^\d+$/.test(input)) return input;
  }
  return null;
}

/**
 * Obtiene el precio en tiempo real de AliExpress usando su Open Platform.
 * Esta función define la estructura básica de la llamada; deberás ajustar
 * endpoint, parámetros y firma según tu cuenta de AliExpress.
 */
export async function getAliExpressPrice(
  rawProductIdOrUrl: string | null
): Promise<number | null> {
  if (!rawProductIdOrUrl) return null;
  if (!ALIEXPRESS_APP_KEY) {
    console.warn(
      "ALIEXPRESS_APP_KEY no está configurada. Se omite la consulta a la API de AliExpress."
    );
    return null;
  }

  const productId = extractProductId(rawProductIdOrUrl);
  if (!productId) {
    console.warn("No se ha podido extraer un productId válido de la URL de AliExpress.");
    return null;
  }

  try {
    // NOTA: endpoint de ejemplo. Deberás adaptarlo al endpoint oficial
    // de AliExpress Open Platform y añadir firma, timestamp, etc.
    const endpoint =
      process.env.ALIEXPRESS_API_ENDPOINT ??
      "https://api-sandbox.aliexpress.com/openapi/placeholder";

    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-app-key": ALIEXPRESS_APP_KEY,
      },
      body: JSON.stringify({
        product_id: productId,
      }),
    });

    if (!res.ok) {
      console.error(
        "Error HTTP al llamar a AliExpress:",
        res.status,
        res.statusText
      );
      return null;
    }

    const json: any = await res.json();
    // Estructura de ejemplo: ajusta las rutas según la respuesta real
    const price =
      json?.data?.price ??
      json?.result?.item?.sale_price ??
      json?.result?.price;

    if (typeof price === "number") {
      return price;
    }

    if (typeof price === "string") {
      const parsed = Number(price.replace(",", "."));
      return Number.isNaN(parsed) ? null : parsed;
    }

    console.warn("No se ha encontrado un precio válido en la respuesta de AliExpress.");
    return null;
  } catch (err: any) {
    console.error(
      "Error al consultar el precio en AliExpress:",
      err?.message ?? err
    );
    return null;
  }
}

