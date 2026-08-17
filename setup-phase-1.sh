#!/usr/bin/env bash
set -e

echo "=========================================="
echo " إنشاء المرحلة الأولى من دليل عدن التجاري "
echo "=========================================="

mkdir -p app
mkdir -p components
mkdir -p lib/supabase

# =========================================================
# package.json
# =========================================================

cat > package.json <<'EOF'
{
  "name": "aden-business-directory",
  "version": "0.1.0",
  "private": true,
  "description": "دليل عدن التجاري - Aden Business Directory",
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "typecheck": "tsc --noEmit"
  },
  "engines": {
    "node": ">=22.0.0"
  },
  "dependencies": {
    "@supabase/ssr": "^0.12.4",
    "@supabase/supabase-js": "^2.112.2",
    "lucide-react": "^0.468.0",
    "next": "16.2.12",
    "react": "^19.2.0",
    "react-dom": "^19.2.0"
  },
  "devDependencies": {
    "@tailwindcss/postcss": "^4.1.0",
    "@types/node": "^22.15.0",
    "@types/react": "^19.2.0",
    "@types/react-dom": "^19.2.0",
    "postcss": "^8.5.0",
    "tailwindcss": "^4.1.0",
    "typescript": "^5.8.0"
  }
}
EOF

# =========================================================
# tsconfig.json
# =========================================================

cat > tsconfig.json <<'EOF'
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": [
      "dom",
      "dom.iterable",
      "esnext"
    ],
    "allowJs": false,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "react-jsx",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": [
        "./*"
      ]
    }
  },
  "include": [
    "next-env.d.ts",
    "**/*.ts",
    "**/*.tsx",
    ".next/types/**/*.ts",
    ".next/dev/types/**/*.ts"
  ],
  "exclude": [
    "node_modules"
  ]
}
EOF

# =========================================================
# next.config.ts
# =========================================================

cat > next.config.ts <<'EOF'
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,

  images: {
    formats: ["image/avif", "image/webp"],
  },

  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(self), payment=()",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
EOF

# =========================================================
# postcss.config.mjs
# =========================================================

cat > postcss.config.mjs <<'EOF'
const config = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};

export default config;
EOF

# =========================================================
# app/globals.css
# =========================================================

cat > app/globals.css <<'EOF'
@import "tailwindcss";

@theme {
  --color-brand-950: #062f28;
  --color-brand-900: #0b493c;
  --color-brand-800: #0e5b4b;
  --color-brand-700: #11705c;
  --color-brand-600: #138a72;
  --color-brand-500: #19a88c;
  --color-brand-400: #39c0a4;
  --color-brand-300: #70d4bd;
  --color-brand-200: #a7e8d8;
  --color-brand-100: #dff7f0;
  --color-brand-50: #f2fbf8;

  --color-gold-700: #8b681d;
  --color-gold-600: #aa8127;
  --color-gold-500: #c99d3a;
  --color-gold-100: #f8edcf;
  --color-gold-50: #fcf8eb;

  --color-surface: #f7f9f8;
  --color-border-soft: #e5ebe8;

  --font-sans:
    "SF Arabic",
    "Geeza Pro",
    "Tahoma",
    "Arial",
    system-ui,
    sans-serif;
}

:root {
  --background: #ffffff;
  --foreground: #12211d;
}

* {
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
}

body {
  min-height: 100vh;
  margin: 0;
  background: var(--background);
  color: var(--foreground);
  font-family:
    "SF Arabic",
    "Geeza Pro",
    Tahoma,
    Arial,
    system-ui,
    sans-serif;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
}

button,
input,
textarea,
select {
  font: inherit;
}

button,
a {
  -webkit-tap-highlight-color: transparent;
}

a {
  color: inherit;
  text-decoration: none;
}

::selection {
  background: #dff7f0;
  color: #062f28;
}

.container-shell {
  width: min(100% - 2rem, 76rem);
  margin-inline: auto;
}

.section-padding {
  padding-block: 4.5rem;
}

.section-heading {
  color: #10241e;
  font-size: clamp(1.65rem, 4vw, 2.4rem);
  font-weight: 800;
  line-height: 1.35;
  letter-spacing: -0.025em;
}

.section-description {
  margin-top: 0.75rem;
  max-width: 42rem;
  color: #62716c;
  font-size: 1rem;
  line-height: 1.9;
}

.surface-card {
  border: 1px solid #e5ebe8;
  border-radius: 1.5rem;
  background: #ffffff;
  box-shadow:
    0 1px 2px rgb(6 47 40 / 0.03),
    0 12px 32px rgb(6 47 40 / 0.04);
}

.focus-ring:focus-visible {
  outline: 3px solid rgb(25 168 140 / 0.25);
  outline-offset: 3px;
}

.hero-pattern {
  background:
    radial-gradient(
      circle at 15% 15%,
      rgb(57 192 164 / 0.17),
      transparent 30%
    ),
    radial-gradient(
      circle at 85% 20%,
      rgb(201 157 58 / 0.12),
      transparent 25%
    ),
    linear-gradient(135deg, #062f28 0%, #0b493c 52%, #0d5b4a 100%);
}

@media (max-width: 640px) {
  .container-shell {
    width: min(100% - 1.25rem, 76rem);
  }

  .section-padding {
    padding-block: 3.5rem;
  }
}

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    scroll-behavior: auto !important;
    transition-duration: 0.01ms !important;
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
  }
}
EOF

# =========================================================
# app/layout.tsx
# =========================================================

cat > app/layout.tsx <<'EOF'
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
EOF

# =========================================================
# components/Header.tsx
# =========================================================

cat > components/Header.tsx <<'EOF'
"use client";

import Link from "next/link";
import { Building2, Menu, Plus, X } from "lucide-react";
import { useState } from "react";

const navigation = [
  { label: "الرئيسية", href: "/" },
  { label: "دليل الأعمال", href: "/businesses" },
  { label: "التصنيفات", href: "/categories" },
  { label: "المتاجر", href: "/businesses" },
  { label: "المنتجات", href: "/products" },
  { label: "العروض", href: "/offers" },
] as const;

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  function closeMenu() {
    setIsOpen(false);
  }

  return (
    <header className="sticky top-0 z-50 border-b border-black/[0.05] bg-white/95 backdrop-blur-xl">
      <div className="container-shell">
        <div className="flex h-[72px] items-center justify-between gap-4">
          <Link
            href="/"
            className="focus-ring flex shrink-0 items-center gap-3 rounded-xl"
            onClick={closeMenu}
            aria-label="دليل عدن التجاري - الرئيسية"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-900 text-white">
              <Building2 className="h-5 w-5" />
            </span>

            <span className="hidden min-[390px]:block">
              <span className="block text-[15px] font-black leading-5 text-brand-950">
                دليل عدن التجاري
              </span>
              <span className="block text-[10px] tracking-wide text-slate-400">
                Aden Business Directory
              </span>
            </span>
          </Link>

          <nav
            className="hidden items-center gap-1 xl:flex"
            aria-label="التنقل الرئيسي"
          >
            {navigation.map((item) => (
              <Link
                key={`${item.label}-${item.href}`}
                href={item.href}
                className="focus-ring rounded-lg px-3 py-2 text-sm font-bold text-slate-600 transition hover:bg-brand-50 hover:text-brand-800"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="hidden shrink-0 items-center gap-2 md:flex">
            <Link
              href="/login"
              className="focus-ring flex h-11 items-center justify-center rounded-xl border border-border-soft px-4 text-sm font-extrabold text-slate-700"
            >
              تسجيل الدخول
            </Link>

            <Link
              href="/add-business"
              className="focus-ring flex h-11 items-center justify-center gap-2 rounded-xl bg-brand-800 px-4 text-sm font-extrabold text-white"
            >
              <Plus className="h-4 w-4" />
              أضف نشاطك التجاري
            </Link>
          </div>

          <button
            type="button"
            onClick={() => setIsOpen((value) => !value)}
            className="focus-ring flex h-11 w-11 items-center justify-center rounded-xl border border-border-soft md:hidden"
            aria-label={isOpen ? "إغلاق القائمة" : "فتح القائمة"}
            aria-expanded={isOpen}
            aria-controls="mobile-navigation"
          >
            {isOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>

        {isOpen ? (
          <div
            id="mobile-navigation"
            className="border-t border-border-soft py-4 md:hidden"
          >
            <nav className="flex flex-col gap-1">
              {navigation.map((item) => (
                <Link
                  key={`${item.label}-${item.href}-mobile`}
                  href={item.href}
                  onClick={closeMenu}
                  className="focus-ring rounded-xl px-4 py-3 text-sm font-bold text-slate-700 hover:bg-brand-50"
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="mt-4 grid gap-2 border-t border-border-soft pt-4">
              <Link
                href="/add-business"
                onClick={closeMenu}
                className="flex h-12 items-center justify-center gap-2 rounded-xl bg-brand-800 text-sm font-extrabold text-white"
              >
                <Plus className="h-4 w-4" />
                أضف نشاطك التجاري
              </Link>

              <Link
                href="/login"
                onClick={closeMenu}
                className="flex h-12 items-center justify-center rounded-xl border border-border-soft text-sm font-extrabold"
              >
                تسجيل الدخول
              </Link>
            </div>
          </div>
        ) : null}
      </div>
    </header>
  );
}
EOF

# =========================================================
# components/CategoryCard.tsx
# =========================================================

cat > components/CategoryCard.tsx <<'EOF'
import Link from "next/link";
import { ArrowUpLeft, type LucideIcon } from "lucide-react";

type CategoryCardProps = {
  name: string;
  slug: string;
  icon: LucideIcon;
};

export default function CategoryCard({
  name,
  slug,
  icon: Icon,
}: CategoryCardProps) {
  return (
    <Link
      href={`/category/${encodeURIComponent(slug)}`}
      className="focus-ring group surface-card flex min-h-32 flex-col justify-between p-4 transition hover:-translate-y-1 hover:border-brand-100"
    >
      <div className="flex items-start justify-between">
        <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-50 text-brand-700 transition group-hover:bg-brand-700 group-hover:text-white">
          <Icon className="h-5 w-5" />
        </span>

        <ArrowUpLeft className="h-4 w-4 text-slate-300" />
      </div>

      <h3 className="mt-5 font-extrabold text-slate-900">
        {name}
      </h3>
    </Link>
  );
}
EOF

# =========================================================
# components/BusinessCard.tsx
# =========================================================

cat > components/BusinessCard.tsx <<'EOF'
import Link from "next/link";
import {
  BadgeCheck,
  Building2,
  MapPin,
  Sparkles,
  Star,
} from "lucide-react";

export type BusinessCardData = {
  id: string;
  name: string;
  slug: string;
  category: string;
  area: string;
  rating: number;
  reviewsCount: number;
  verified: boolean;
  featured: boolean;
  description?: string | null;
};

type BusinessCardProps = {
  business: BusinessCardData;
};

export default function BusinessCard({
  business,
}: BusinessCardProps) {
  return (
    <article className="surface-card group overflow-hidden transition hover:-translate-y-1">
      <Link
        href={`/business/${encodeURIComponent(business.slug)}`}
        className="focus-ring block"
      >
        <div className="relative flex aspect-[16/8.5] items-center justify-center overflow-hidden bg-gradient-to-br from-brand-950 via-brand-800 to-brand-600">
          <Building2 className="h-16 w-16 text-white/25" />

          {business.featured ? (
            <span className="absolute top-3 right-3 inline-flex items-center gap-1 rounded-full bg-gold-100 px-3 py-1.5 text-xs font-extrabold text-gold-700">
              <Sparkles className="h-3.5 w-3.5" />
              مميز
            </span>
          ) : null}

          <div className="absolute right-4 -bottom-7 flex h-16 w-16 items-center justify-center rounded-2xl border-4 border-white bg-white text-brand-800 shadow-md">
            <Building2 className="h-7 w-7" />
          </div>
        </div>

        <div className="px-5 pt-10 pb-5">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <h3 className="truncate text-lg font-black text-slate-900">
                  {business.name}
                </h3>

                {business.verified ? (
                  <BadgeCheck className="h-5 w-5 shrink-0 fill-brand-600 text-white" />
                ) : null}
              </div>

              <p className="mt-1 text-sm font-semibold text-brand-700">
                {business.category}
              </p>
            </div>

            <div className="flex shrink-0 items-center gap-1 rounded-lg bg-gold-50 px-2 py-1">
              <Star className="h-4 w-4 fill-gold-500 text-gold-500" />
              <span className="text-sm font-extrabold">
                {business.rating.toFixed(1)}
              </span>
            </div>
          </div>

          {business.description ? (
            <p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-500">
              {business.description}
            </p>
          ) : null}

          <div className="mt-4 flex items-center justify-between border-t border-border-soft pt-4">
            <span className="inline-flex items-center gap-1.5 text-sm text-slate-500">
              <MapPin className="h-4 w-4 text-brand-600" />
              {business.area}
            </span>

            <span className="text-xs text-slate-400">
              {business.reviewsCount.toLocaleString("ar-YE")} تقييم
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}
EOF

# =========================================================
# app/page.tsx
# =========================================================

cat > app/page.tsx <<'EOF'
import Link from "next/link";
import {
  ArrowLeft,
  BadgeCheck,
  CheckCircle2,
  ChevronLeft,
  MapPin,
  Search,
  ShoppingBag,
  Smartphone,
  Sparkles,
  Store,
  TrendingUp,
} from "lucide-react";

import BusinessCard, {
  type BusinessCardData,
} from "@/components/BusinessCard";
import CategoryCard from "@/components/CategoryCard";

const categories = [
  { name: "العطور", slug: "perfumes", icon: Sparkles },
  { name: "المطاعم", slug: "restaurants", icon: Store },
  { name: "الكافيهات", slug: "cafes", icon: Store },
  { name: "الأزياء", slug: "fashion", icon: ShoppingBag },
  { name: "الإلكترونيات", slug: "electronics", icon: Smartphone },
  { name: "الجوالات", slug: "mobiles", icon: Smartphone },
  { name: "التجميل", slug: "beauty", icon: Sparkles },
  { name: "الخدمات", slug: "services", icon: BadgeCheck },
];

const areas = [
  "كريتر",
  "المعلا",
  "التواهي",
  "خور مكسر",
  "المنصورة",
  "الشيخ عثمان",
  "دار سعد",
  "البريقة",
  "إنماء",
  "عدن الجديدة",
];

const featuredBusinesses: BusinessCardData[] = [
  {
    id: "preview-1",
    name: "متجر عطور عدن",
    slug: "aden-perfumes-preview",
    category: "العطور",
    area: "المنصورة",
    rating: 4.9,
    reviewsCount: 128,
    verified: true,
    featured: true,
    description:
      "تشكيلة مختارة من العطور الشرقية والعالمية ومنتجات الهدايا.",
  },
  {
    id: "preview-2",
    name: "مذاق عدن",
    slug: "aden-taste-preview",
    category: "المطاعم",
    area: "كريتر",
    rating: 4.8,
    reviewsCount: 94,
    verified: true,
    featured: true,
    description:
      "أطباق محلية وعربية في تجربة تجمع الجودة والضيافة العدنية.",
  },
  {
    id: "preview-3",
    name: "تقنية المدينة",
    slug: "city-tech-preview",
    category: "الجوالات",
    area: "الشيخ عثمان",
    rating: 4.7,
    reviewsCount: 76,
    verified: true,
    featured: false,
    description:
      "هواتف وإكسسوارات وحلول تقنية مع خدمات ما بعد البيع.",
  },
];

const products = [
  {
    name: "عطر شرقي فاخر",
    business: "متجر عطور عدن",
    price: "18,000 ر.ي",
  },
  {
    name: "سماعة لاسلكية",
    business: "تقنية المدينة",
    price: "12,500 ر.ي",
  },
  {
    name: "حقيبة نسائية",
    business: "أناقة عدن",
    price: "9,500 ر.ي",
  },
  {
    name: "طقم ضيافة",
    business: "بيت المنزل",
    price: "14,000 ر.ي",
  },
];

export default function HomePage() {
  return (
    <>
      <section className="hero-pattern relative overflow-hidden text-white">
        <div className="container-shell py-16 sm:py-24">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm">
              <MapPin className="h-4 w-4" />
              دليلك المحلي للأعمال والخدمات في عدن
            </div>

            <h1 className="text-4xl leading-[1.35] font-black sm:text-5xl lg:text-6xl">
              اكتشف أفضل المتاجر
              <span className="block text-brand-100">
                والخدمات في عدن
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-white/75 sm:text-lg">
              منصة محلية تجمع الأعمال والمتاجر والخدمات والمنتجات والعروض
              في مكان واحد.
            </p>

            <form
              action="/search"
              method="get"
              className="mx-auto mt-9 max-w-3xl"
            >
              <div className="flex flex-col gap-2 rounded-3xl bg-white p-2 shadow-2xl sm:flex-row">
                <div className="relative flex-1">
                  <Search className="absolute top-1/2 right-4 h-5 w-5 -translate-y-1/2 text-slate-400" />

                  <input
                    name="q"
                    type="search"
                    placeholder="ابحث عن متجر، منتج، خدمة، تصنيف أو منطقة..."
                    className="h-14 w-full rounded-xl pr-12 pl-4 text-slate-900 outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="flex h-14 items-center justify-center gap-2 rounded-xl bg-brand-700 px-8 font-bold text-white hover:bg-brand-800"
                >
                  <Search className="h-5 w-5" />
                  بحث
                </button>
              </div>
            </form>

            <div className="mt-5 flex flex-wrap justify-center gap-2 text-sm text-white/70">
              {[
                "عطور",
                "مطاعم",
                "جوالات",
                "كريتر",
                "المنصورة",
                "خور مكسر",
              ].map((example) => (
                <Link
                  key={example}
                  href={`/search?q=${encodeURIComponent(example)}`}
                  className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5"
                >
                  {example}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-shell">
          <p className="text-sm font-bold text-brand-700">
            اكتشف حسب اهتماماتك
          </p>

          <h2 className="section-heading mt-2">
            التصنيفات
          </h2>

          <p className="section-description">
            وصول سريع إلى أكثر الأنشطة والخدمات التي يبحث عنها سكان وزوار
            عدن.
          </p>

          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {categories.map((category) => (
              <CategoryCard
                key={category.slug}
                name={category.name}
                slug={category.slug}
                icon={category.icon}
              />
            ))}
          </div>

          <Link
            href="/categories"
            className="mt-6 inline-flex items-center gap-1 font-bold text-brand-700"
          >
            جميع التصنيفات
            <ChevronLeft className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <section className="section-padding bg-surface">
        <div className="container-shell">
          <p className="text-sm font-bold text-brand-700">
            أين تبحث؟
          </p>

          <h2 className="section-heading mt-2">
            مناطق عدن
          </h2>

          <p className="section-description">
            تصفح الأنشطة التجارية والخدمات حسب المنطقة الأقرب إليك.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            {areas.map((area) => (
              <Link
                key={area}
                href={`/search?area=${encodeURIComponent(area)}`}
                className="inline-flex items-center gap-2 rounded-full border border-border-soft bg-white px-4 py-3 font-bold text-slate-700"
              >
                <MapPin className="h-4 w-4 text-brand-600" />
                {area}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-shell">
          <p className="text-sm font-bold text-gold-700">
            أعمال تستحق الاكتشاف
          </p>

          <h2 className="section-heading mt-2">
            المتاجر المميزة
          </h2>

          <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {featuredBusinesses.map((business) => (
              <BusinessCard
                key={business.id}
                business={business}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-surface">
        <div className="container-shell">
          <p className="text-sm font-bold text-brand-700">
            تسوق محليًا
          </p>

          <h2 className="section-heading mt-2">
            منتجات مختارة
          </h2>

          <div className="mt-8 grid grid-cols-2 gap-3 lg:grid-cols-4">
            {products.map((product) => (
              <article
                key={`${product.name}-${product.business}`}
                className="surface-card overflow-hidden"
              >
                <div className="flex aspect-square items-center justify-center bg-brand-50">
                  <ShoppingBag className="h-14 w-14 text-brand-200" />
                </div>

                <div className="p-4">
                  <p className="text-xs font-semibold text-brand-700">
                    {product.business}
                  </p>

                  <h3 className="mt-1 font-extrabold text-slate-900">
                    {product.name}
                  </h3>

                  <p className="mt-3 font-black text-brand-800">
                    {product.price}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-brand-950 text-white">
        <div className="container-shell">
          <h2 className="text-3xl font-black sm:text-4xl">
            لماذا دليل عدن التجاري؟
          </h2>

          <div className="mt-10 grid gap-4 md:grid-cols-3">
            <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-6">
              <MapPin className="h-7 w-7 text-brand-300" />
              <h3 className="mt-5 text-lg font-extrabold">
                دليل محلي
              </h3>
              <p className="mt-2 text-sm leading-7 text-white/60">
                اكتشف الأعمال والخدمات حسب المنطقة.
              </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-6">
              <BadgeCheck className="h-7 w-7 text-brand-300" />
              <h3 className="mt-5 text-lg font-extrabold">
                معلومات موثوقة
              </h3>
              <p className="mt-2 text-sm leading-7 text-white/60">
                نظام مراجعة وتوثيق للأنشطة التجارية.
              </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-6">
              <TrendingUp className="h-7 w-7 text-brand-300" />
              <h3 className="mt-5 text-lg font-extrabold">
                نمو لأصحاب الأعمال
              </h3>
              <p className="mt-2 text-sm leading-7 text-white/60">
                اعرض منتجاتك وعروضك وتواصل مع العملاء.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-shell">
          <div className="rounded-[2rem] bg-brand-800 px-6 py-10 text-white sm:px-10 lg:p-14">
            <h2 className="text-3xl font-black">
              أضف نشاطك التجاري
            </h2>

            <p className="mt-4 max-w-2xl leading-8 text-white/70">
              أنشئ صفحة احترافية لنشاطك، واعرض منتجاتك وعروضك، وسهّل على
              العملاء الوصول إليك.
            </p>

            <div className="mt-6 flex flex-wrap gap-4 text-sm">
              <span className="inline-flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4" />
                صفحة احترافية
              </span>

              <span className="inline-flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4" />
                منتجات وعروض
              </span>
            </div>

            <Link
              href="/add-business"
              className="mt-8 inline-flex h-14 items-center justify-center gap-2 rounded-xl bg-white px-7 font-extrabold text-brand-900"
            >
              أضف نشاطك التجاري
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-border-soft bg-surface">
        <div className="container-shell py-10">
          <p className="font-black text-brand-950">
            دليل عدن التجاري
          </p>

          <p className="mt-2 text-sm text-slate-500">
            Aden Business Directory
          </p>

          <p className="mt-6 text-xs text-slate-400">
            © {new Date().getFullYear()} دليل عدن التجاري. جميع الحقوق
            محفوظة.
          </p>
        </div>
      </footer>
    </>
  );
}
EOF

# =========================================================
# lib/supabase/env.ts
# =========================================================

cat > lib/supabase/env.ts <<'EOF'
type SupabasePublicEnvironment = {
  url: string;
  publishableKey: string;
};

export function getSupabasePublicEnvironment(): SupabasePublicEnvironment {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;

  const publishableKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL environment variable.",
    );
  }

  if (!publishableKey) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY environment variable.",
    );
  }

  return {
    url,
    publishableKey,
  };
}
EOF

# =========================================================
# lib/supabase/client.ts
# =========================================================

cat > lib/supabase/client.ts <<'EOF'
import { createBrowserClient } from "@supabase/ssr";

import { getSupabasePublicEnvironment } from "@/lib/supabase/env";

export function createClient() {
  const { url, publishableKey } =
    getSupabasePublicEnvironment();

  return createBrowserClient(url, publishableKey);
}
EOF

# =========================================================
# lib/supabase/server.ts
# =========================================================

cat > lib/supabase/server.ts <<'EOF'
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

import { getSupabasePublicEnvironment } from "@/lib/supabase/env";

export async function createClient() {
  const cookieStore = await cookies();

  const { url, publishableKey } =
    getSupabasePublicEnvironment();

  return createServerClient(url, publishableKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },

      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          /*
           * Server Components may not write cookies directly.
           * Auth session refreshing will be added later.
           */
        }
      },
    },
  });
}
EOF

# =========================================================
# .env.local.example
# =========================================================

cat > .env.local.example <<'EOF'
NEXT_PUBLIC_SITE_URL=http://localhost:3000

NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co

NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=YOUR_SUPABASE_PUBLISHABLE_KEY
EOF

# =========================================================
# .gitignore
# =========================================================

cat > .gitignore <<'EOF'
node_modules
.next
out
dist

.env
.env.local
.env.development.local
.env.test.local
.env.production.local

*.log
.DS_Store

.vercel
EOF

echo ""
echo "=========================================="
echo " تم إنشاء ملفات المرحلة الأولى بنجاح "
echo "=========================================="
echo ""
echo "الخطوة التالية:"
echo "1. npm install"
echo "2. cp .env.local.example .env.local"
echo "3. ضع بيانات Supabase داخل .env.local"
echo "4. npm run typecheck"
echo "5. npm run build"
echo "6. npm run dev"
echo ""