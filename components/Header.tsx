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
