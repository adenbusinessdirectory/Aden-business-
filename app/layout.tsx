import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";

import Header from "@/components/Header";

import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  ),
  title: {
    default: "دليل عدن التجاري",
    template: "%s | دليل عدن التجاري",
  },
  description:
    "منصة محلية تجمع الأعمال والمتاجر والخدمات والمنتجات والعروض في مدينة عدن في مكان واحد.",
  applicationName: "دليل عدن التجاري",
  keywords: [
    "دليل عدن التجاري",
    "عدن",
    "متاجر عدن",
    "خدمات عدن",
    "مطاعم عدن",
    "عروض عدن",
    "منتجات عدن",
    "Aden Business Directory"
  ],
  openGraph: {
    type: "website",
    locale: "ar_YE",
    siteName: "دليل عدن التجاري",
    title: "دليل عدن التجاري",
    description:
      "اكتشف أفضل المتاجر والخدمات والمنتجات والعروض في عدن.",
  },
  twitter: {
    card: "summary_large_image",
    title: "دليل عدن التجاري",
    description:
      "اكتشف أفضل المتاجر والخدمات والمنتجات والعروض في عدن.",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#0b493c",
  colorScheme: "light",
};

type RootLayoutProps = Readonly<{
  children: ReactNode;
}>;

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="ar" dir="rtl">
      <body>
        <Header />
        <main>{children}</main>
      </body>
    </html>
  );
}
