import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Weats - AI-Powered WhatsApp Food Delivery",
  description: "Disrumpiendo Rappi con economía justa. $0 tarifas cliente, 5-10% comisiones restaurante, pago 3x mejor para domiciliarios.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
