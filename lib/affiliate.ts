const AMAZON_TAG = process.env.AMAZON_TAG ?? process.env.NEXT_PUBLIC_AMAZON_TAG;
const PCCOMPONENTES_ID =
  process.env.PCC_PARTNER_ID ?? process.env.NEXT_PUBLIC_PCCOMPONENTES_AFFILIATE_ID;
const ALIEXPRESS_APP_KEY = process.env.ALIEXPRESS_APP_KEY;

/**
 * Devuelve una URL con parámetros de afiliado según la tienda.
 * Si falta la configuración de afiliado o la URL es inválida, devuelve la URL original.
 */
export function getAffiliateUrl(rawUrl: string | null | undefined): string | null {
    if (!rawUrl) return null;

    let url: URL;
    try {
        url = new URL(rawUrl);
    } catch {
        return rawUrl;
    }

    const host = url.hostname.toLowerCase();

    // Amazon: añadir ?tag=ID_AFILIADO
    if (host.includes("amazon.") && AMAZON_TAG) {
        url.searchParams.set("tag", AMAZON_TAG);
        return url.toString();
    }

    // PCComponentes: añadir un parámetro de referencia sencillo
    // Ajusta el formato si ya tienes un esquema oficial de referidos.
    if (host.includes("pccomponentes.com") && PCCOMPONENTES_ID) {
        url.searchParams.set("affiliate_id", PCCOMPONENTES_ID);
        return url.toString();
    }

    // AliExpress: usar plantilla de portal de afiliados
    // Si ya es un enlace de s.click.aliexpress.com, lo devolvemos tal cual.
    if (host.includes("s.click.aliexpress.com")) {
        return rawUrl;
    }

    if (host.includes("aliexpress.") && ALIEXPRESS_APP_KEY) {
        const encodedTarget = encodeURIComponent(rawUrl);
        return `https://s.click.aliexpress.com/e/${ALIEXPRESS_APP_KEY}?dl_target_url=${encodedTarget}`;
    }

    return rawUrl;
}

