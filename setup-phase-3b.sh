#!/usr/bin/env bash
set -e

echo "=========================================="
echo " دليل عدن التجاري - إكمال المرحلة الثالثة"
echo " Auth Header + Current User + Sign out"
echo "=========================================="

# =========================================================
# components/HeaderClient.tsx
# =========================================================

cat > components/HeaderClient.tsx <<'EOF'
"use client";

import Link from "next/link";
import {
  Building2,
  LogOut,
  Menu,
  Plus,
  UserRound,
  X,
} from "lucide-react";
import { useState } from "react";

type HeaderClientProps = {
  isAuthenticated: boolean;
  displayName: string | null;
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

export default function HeaderClient({
  isAuthenticated,
  displayName,
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
                  href="/dashboard"
                  className="focus-ring flex h-11 items-center justify-center gap-2 rounded-xl border border-border-soft bg-white px-4 text-sm font-extrabold text-slate-700 transition hover:border-brand-200 hover:bg-brand-50 hover:text-brand-800"
                >
                  <UserRound className="h-4 w-4" />

                  <span className="max-w-32 truncate">
                    {displayName || "حسابي"}
                  </span>
                </Link>

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
                    href="/dashboard"
                    onClick={closeMenu}
                    className="focus-ring flex h-12 items-center justify-center gap-2 rounded-xl border border-border-soft bg-white px-4 text-sm font-extrabold text-slate-700"
                  >
                    <UserRound className="h-4 w-4" />
                    {displayName || "حسابي"}
                  </Link>

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
EOF

# =========================================================
# components/Header.tsx
# Server Component
# =========================================================

cat > components/Header.tsx <<'EOF'
import HeaderClient from "@/components/HeaderClient";
import { createClient } from "@/lib/supabase/server";

export default async function Header() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const fullName =
    typeof user?.user_metadata?.full_name === "string"
      ? user.user_metadata.full_name.trim()
      : "";

  const displayName =
    fullName ||
    user?.email?.split("@")[0] ||
    null;

  return (
    <HeaderClient
      isAuthenticated={Boolean(user)}
      displayName={displayName}
    />
  );
}
EOF

# =========================================================
# app/dashboard/page.tsx
# Temporary authenticated account landing page
# =========================================================

mkdir -p app/dashboard

cat > app/dashboard/page.tsx <<'EOF'
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import {
  LayoutDashboard,
  Mail,
  ShieldCheck,
  UserRound,
} from "lucide-react";

import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "حسابي",
};

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const fullName =
    typeof user.user_metadata?.full_name === "string"
      ? user.user_metadata.full_name
      : "مستخدم دليل عدن";

  return (
    <section className="min-h-[calc(100vh-72px)] bg-surface py-10 sm:py-16">
      <div className="container-shell">
        <div className="mx-auto max-w-3xl">
          <div className="surface-card overflow-hidden">
            <div className="bg-gradient-to-l from-brand-950 to-brand-800 px-6 py-8 text-white sm:px-8">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10">
                <LayoutDashboard className="h-6 w-6" />
              </div>

              <h1 className="mt-5 text-2xl font-black">
                حسابي
              </h1>

              <p className="mt-2 text-sm leading-7 text-white/70">
                تم تسجيل الدخول إلى دليل عدن التجاري بنجاح.
              </p>
            </div>

            <div className="grid gap-4 p-6 sm:grid-cols-2 sm:p-8">
              <div className="rounded-2xl border border-border-soft bg-white p-5">
                <div className="flex items-center gap-3">
                  <UserRound className="h-5 w-5 text-brand-700" />

                  <div>
                    <p className="text-xs text-slate-400">
                      الاسم
                    </p>

                    <p className="mt-1 font-extrabold text-slate-900">
                      {fullName}
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-border-soft bg-white p-5">
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-brand-700" />

                  <div className="min-w-0">
                    <p className="text-xs text-slate-400">
                      البريد الإلكتروني
                    </p>

                    <p
                      dir="ltr"
                      className="mt-1 truncate text-left font-bold text-slate-900"
                    >
                      {user.email}
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-brand-100 bg-brand-50 p-5 sm:col-span-2">
                <div className="flex items-start gap-3">
                  <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-brand-700" />

                  <div>
                    <h2 className="font-extrabold text-brand-950">
                      المصادقة تعمل
                    </h2>

                    <p className="mt-1 text-sm leading-7 text-brand-800/70">
                      هذه الصفحة محمية على السيرفر ولا تظهر
                      للمستخدم غير المسجل. ربط صلاحيات
                      Customer وMerchant وAdmin سيتم بعد
                      فحص جدول profiles وسياسات RLS الحالية.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
EOF

echo ""
echo "=========================================="
echo " فحص TypeScript"
echo "=========================================="

npm run typecheck

echo ""
echo "=========================================="
echo " Production Build"
echo "=========================================="

npm run build

echo ""
echo "=========================================="
echo " اكتملت المرحلة الثالثة"
echo "=========================================="
echo ""
echo "تمت إضافة:"
echo "- قراءة المستخدم الحالي من Supabase"
echo "- Header يتغير بعد تسجيل الدخول"
echo "- زر تسجيل الخروج"
echo "- صفحة /dashboard محمية"
echo ""