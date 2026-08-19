"use client";

import Link from "next/link";
import {
  Building2,
  Crown,
  LogOut,
  Menu,
  Plus,
  ShieldCheck,
  Store,
  UserRound,
  X,
} from "lucide-react";
import { useState } from "react";

import type { AppRole } from "@/lib/auth";

type HeaderClientProps = {
  isAuthenticated: boolean;
  displayName: string | null;
  accountHref: string;
  role: AppRole | null;
};

const navigation = [
  {
    label: "الرئيسية",
    href: "/",
  },
  {
    label: "دليل الأعمال",
    href: "/businesses",
  },
  {
    label: "التصنيفات",
    href: "/categories",
  },
  {
    label: "المتاجر",
    href: "/businesses",
  },
  {
    label: "المنتجات",
    href: "/products",
  },
  {
    label: "العروض",
    href: "/offers",
  },
] as const;

function RoleIcon({
  role,
}: {
  role: AppRole | null;
}) {
  if (role === "admin") {
    return <Crown className="h-4 w-4" />;
  }

  if (role === "merchant") {
    return <Store className="h-4 w-4" />;
  }

  return <UserRound className="h-4 w-4" />;
}

export default function HeaderClient({
  isAuthenticated,
  displayName,
  accountHref,
  role,
}: HeaderClientProps) {
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
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-900 text-white shadow-sm">
              <Building2 className="h-5 w-5" />
            </span>

            <span className="hidden min-[390px]:block">
              <span className="block text-[15px] font-black leading-5 text-brand-950 sm:text-base">
                دليل عدن التجاري
              </span>

              <span className="block text-[10px] tracking-wide text-slate-400 sm:text-[11px]">
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
            {isAuthenticated ? (
              <>
                <Link
                  href={accountHref}
                  className="focus-ring flex h-11 items-center justify-center gap-2 rounded-xl border border-border-soft bg-white px-4 text-sm font-extrabold text-slate-700 transition hover:border-brand-200 hover:bg-brand-50 hover:text-brand-800"
                >
                  <RoleIcon role={role} />

                  <span className="max-w-32 truncate">
                    {displayName || "حسابي"}
                  </span>
                </Link>

                {role === "admin" ? (
                  <Link
                    href="/admin"
                    className="focus-ring flex h-11 items-center justify-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 text-sm font-extrabold text-amber-800"
                  >
                    <ShieldCheck className="h-4 w-4" />
                    الإدارة
                  </Link>
                ) : null}

                <form
                  action="/auth/signout"
                  method="post"
                >
                  <button
                    type="submit"
                    className="focus-ring flex h-11 items-center justify-center gap-2 rounded-xl border border-border-soft bg-white px-4 text-sm font-extrabold text-slate-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-700"
                  >
                    <LogOut className="h-4 w-4" />
                    خروج
                  </button>
                </form>
              </>
            ) : (
              <Link
                href="/login"
                className="focus-ring flex h-11 items-center justify-center rounded-xl border border-border-soft bg-white px-4 text-sm font-extrabold text-slate-700 transition hover:border-brand-200 hover:bg-brand-50 hover:text-brand-800"
              >
                تسجيل الدخول
              </Link>
            )}

            <Link
              href="/add-business"
              className="focus-ring flex h-11 items-center justify-center gap-2 rounded-xl bg-brand-800 px-4 text-sm font-extrabold text-white shadow-sm transition hover:bg-brand-900"
            >
              <Plus className="h-4 w-4" />
              أضف نشاطك التجاري
            </Link>
          </div>

          <button
            type="button"
            onClick={() => setIsOpen((value) => !value)}
            className="focus-ring flex h-11 w-11 items-center justify-center rounded-xl border border-border-soft bg-white text-slate-700 md:hidden"
            aria-label={
              isOpen
                ? "إغلاق القائمة"
                : "فتح القائمة"
            }
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
            <nav
              className="flex flex-col gap-1"
              aria-label="التنقل الرئيسي للجوال"
            >
              {navigation.map((item) => (
                <Link
                  key={`${item.label}-${item.href}-mobile`}
                  href={item.href}
                  onClick={closeMenu}
                  className="focus-ring rounded-xl px-4 py-3 text-sm font-bold text-slate-700 transition hover:bg-brand-50 hover:text-brand-800"
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="mt-4 grid gap-2 border-t border-border-soft pt-4">
              {isAuthenticated ? (
                <>
                  <Link
                    href={accountHref}
                    onClick={closeMenu}
                    className="focus-ring flex h-12 items-center justify-center gap-2 rounded-xl border border-border-soft bg-white px-4 text-sm font-extrabold text-slate-700"
                  >
                    <RoleIcon role={role} />
                    {displayName || "حسابي"}
                  </Link>

                  {role === "admin" ? (
                    <Link
                      href="/admin"
                      onClick={closeMenu}
                      className="focus-ring flex h-12 items-center justify-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 text-sm font-extrabold text-amber-800"
                    >
                      <ShieldCheck className="h-4 w-4" />
                      لوحة الإدارة
                    </Link>
                  ) : null}

                  <form
                    action="/auth/signout"
                    method="post"
                  >
                    <button
                      type="submit"
                      className="focus-ring flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-red-100 bg-red-50 px-4 text-sm font-extrabold text-red-700"
                    >
                      <LogOut className="h-4 w-4" />
                      تسجيل الخروج
                    </button>
                  </form>
                </>
              ) : (
                <Link
                  href="/login"
                  onClick={closeMenu}
                  className="focus-ring flex h-12 items-center justify-center rounded-xl border border-border-soft px-4 text-sm font-extrabold text-slate-700"
                >
                  تسجيل الدخول
                </Link>
              )}

              <Link
                href="/add-business"
                onClick={closeMenu}
                className="focus-ring flex h-12 items-center justify-center gap-2 rounded-xl bg-brand-800 px-4 text-sm font-extrabold text-white"
              >
                <Plus className="h-4 w-4" />
                أضف نشاطك التجاري
              </Link>
            </div>
          </div>
        ) : null}
      </div>
    </header>
  );
}
