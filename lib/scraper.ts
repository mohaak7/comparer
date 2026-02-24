import { chromium, type Browser } from "playwright";

// Random User-Agents to reduce fingerprinting
const USER_AGENTS = [
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
];

function randomUA() {
    return USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)];
}

let _browser: Browser | null = null;

async function getBrowser(): Promise<Browser> {
    if (!_browser || !_browser.isConnected()) {
        _browser = await chromium.launch({ headless: true });
    }
    return _browser;
}

export async function closeBrowser() {
    if (_browser) {
        await _browser.close();
        _browser = null;
    }
}

/**
 * Scrape the current price from a retailer product page.
 * Currently supports PCComponentes selectors.
 * Returns the price as a number, or null if not found.
 */
export async function getLatestPrice(
    url: string,
    store: string
): Promise<number | null> {
    const browser = await getBrowser();
    const context = await browser.newContext({
        userAgent: randomUA(),
        locale: "es-ES",
    });
    await context.route("**/*", (route) => {
        const type = route.request().resourceType();
        if (type === "image" || type === "stylesheet" || type === "font") {
            return route.abort();
        }
        return route.continue();
    });
    const page = await context.newPage();

    try {
        console.log(`  🌐 Navigating to: ${url}`);
        await page.goto(url, { waitUntil: "domcontentloaded", timeout: 30000 });

        // Wait for the price element to appear
        // PCComponentes uses #precio-main or data-testid selectors
        const priceSelectors = [
            "#precio-main",
            '[data-testid="product-price"]',
            ".precio-main",
            "#pdp-price-current-integer",
            'span[data-price]',
        ];

        let priceText: string | null = null;

        for (const selector of priceSelectors) {
            try {
                const el = await page.waitForSelector(selector, { timeout: 5000 });
                if (el) {
                    priceText = await el.textContent();
                    if (priceText) {
                        console.log(`  ✅ Found price with selector "${selector}": ${priceText.trim()}`);
                        break;
                    }
                }
            } catch {
                // Try next selector
            }
        }

        // Fallback: look for any element with € sign
        if (!priceText) {
            try {
                const el = await page.locator('text=/\\d+[.,]\\d{2}\\s*€/').first();
                priceText = await el.textContent({ timeout: 3000 });
                if (priceText) {
                    console.log(`  ✅ Found price via regex fallback: ${priceText.trim()}`);
                }
            } catch {
                // No price found
            }
        }

        if (!priceText) {
            console.log(`  ❌ Could not find price on page`);
            return null;
        }

        // Parse: "2.199,00€" → 2199.00
        const cleaned = priceText
            .replace(/[^\d.,]/g, "")   // keep digits, dots, commas
            .replace(/\./g, "")         // remove thousand separators
            .replace(",", ".");         // convert decimal comma to dot

        const price = parseFloat(cleaned);
        if (isNaN(price)) {
            console.log(`  ❌ Could not parse price: "${priceText.trim()}"`);
            return null;
        }

        console.log(`  💰 Parsed price: ${price}€`);
        return price;
    } catch (error: any) {
        console.error(`  ❌ Scrape error: ${error.message}`);
        return null;
    } finally {
        await context.close();
    }
}
