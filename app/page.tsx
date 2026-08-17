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
