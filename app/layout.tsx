import type { Metadata } from "next";
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
