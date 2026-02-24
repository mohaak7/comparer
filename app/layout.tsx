import type { Metadata } from "next";
import Link from "next/link";
import { Search as SearchIcon } from "lucide-react";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Comparer - Comparador de precios de hardware",
  description: "Encuentra el mejor precio para componentes de PC, smartphones y hardware. Comparativa actualizada de Amazon, PCComponentes, MediaMarkt y más.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="min-h-screen flex flex-col">
          <header className="border-b bg-background/80 backdrop-blur">
            <div className="max-w-6xl mx-auto flex items-center justify-between gap-4 px-6 py-3 md:px-8">
              <Link href="/" className="font-semibold tracking-tight text-lg">
                Comparer
              </Link>
              <form
                action="/search"
                className="hidden sm:flex items-center gap-2 rounded-full border bg-background px-4 py-1.5 text-sm w-full max-w-md"
              >
                <SearchIcon className="w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  name="q"
                  placeholder="Buscar componente o producto"
                  className="flex-1 bg-transparent outline-none"
                />
              </form>
            </div>
          </header>
          <main className="flex-1">{children}</main>
          <footer className="border-t bg-muted/40 text-xs text-muted-foreground px-6 py-4 mt-8">
            <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
              <p className="text-center md:text-left">
                Participamos en los programas de afiliados de Amazon, PCComponentes y AliExpress.
                Algunos enlaces pueden generar una pequeña comisión sin coste adicional para ti.
              </p>
              <div className="flex items-center gap-4">
                <a href="/quienes-somos" className="hover:underline">
                  Quiénes somos
                </a>
                <a href="/contacto" className="hover:underline">
                  Contacto
                </a>
                <a href="/terminos" className="hover:underline">
                  Términos de servicio
                </a>
                <a href="/privacidad" className="hover:underline">
                  Privacidad
                </a>
                <span className="text-[10px] md:text-xs text-muted-foreground/80">
                  © 2024 - Comparer
                </span>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
