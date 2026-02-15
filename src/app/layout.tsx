import type { Metadata, Viewport } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/auth-context";
import { DataProvider } from "@/contexts/data-context";
import { PwaReload } from "@/components/pwa-reload";
import { SplashScreen } from "@/components/splash-screen";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

export const metadata: Metadata = {
  title: "RentTruth - Puntuación Verificada de Inquilinos y Propietarios",
  description: "La única plataforma de puntuación donde las reseñas existen solo bajo contratos verificados.",
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  themeColor: "#020817", // Updated to Midnight Navy
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${outfit.variable} antialiased bg-slate-50`}
      >
        <AuthProvider>
          <DataProvider>
            <SplashScreen />
            {children}
            <PwaReload />
          </DataProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
