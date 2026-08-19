#!/usr/bin/env bash
set -e

echo "=========================================="
echo " دليل عدن التجاري - المرحلة الرابعة"
echo " Roles + Authorization"
echo "=========================================="

mkdir -p app/account
mkdir -p app/admin
mkdir -p app/dashboard
mkdir -p lib

# =========================================================
# lib/auth.ts
# =========================================================

cat > lib/auth.ts <<'EOF'
import type { User } from "@supabase/supabase-js";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

export type AppRole =
  | "customer"
  | "merchant"
  | "admin";

export type CurrentProfile = {
  id: string;
  full_name: string | null;
  phone: string | null;
  avatar_url: string | null;
  role: AppRole;
  created_at: string;
  updated_at: string;
};

export type AuthContext = {
  user: User;
  profile: CurrentProfile | null;
  role: AppRole;
};

function normalizeRole(
  value: unknown,
): AppRole {
  if (value === "merchant") {
    return "merchant";
  }

  if (value === "admin") {
    return "admin";
  }

  return "customer";
}

export async function getAuthContext(): Promise<
  AuthContext | null
> {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return null;
  }

  const {
    data: profile,
    error: profileError,
  } = await supabase
    .from("profiles")
    .select(
      `
        id,
        full_name,
        phone,
        avatar_url,
        role,
        created_at,
        updated_at
      `,
    )
    .eq("id", user.id)
    .maybeSingle();

  if (profileError) {
    console.error(
      "Unable to read current profile:",
      profileError.message,
    );
  }

  const normalizedProfile = profile
    ? {
        id: profile.id,
        full_name: profile.full_name,
        phone: profile.phone,
        avatar_url: profile.avatar_url,
        role: normalizeRole(profile.role),
        created_at: profile.created_at,
        updated_at: profile.updated_at,
      }
    : null;

  return {
    user,
    profile: normalizedProfile,
    role: normalizedProfile?.role ?? "customer",
  };
}

export async function requireUser(): Promise<AuthContext> {
  const context = await getAuthContext();

  if (!context) {
    redirect("/login");
  }

  return context;
}

export async function requireMerchant(): Promise<AuthContext> {
  const context = await requireUser();

  if (
    context.role !== "merchant" &&
    context.role !== "admin"
  ) {
    redirect("/account?error=merchant_required");
  }

  return context;
}

export async function requireAdmin(): Promise<AuthContext> {
  const context = await requireUser();

  if (context.role !== "admin") {
    redirect("/account?error=admin_required");
  }

  return context;
}

export function roleLabel(
  role: AppRole,
): string {
  switch (role) {
    case "admin":
      return "مدير النظام";

    case "merchant":
      return "تاجر";

    default:
      return "عميل";
  }
}

export function roleHome(
  role: AppRole,
): string {
  switch (role) {
    case "admin":
      return "/admin";

    case "merchant":
      return "/dashboard";

    default:
      return "/account";
  }
}
EOF

# =========================================================
# components/Header.tsx
# =========================================================

cat > components/Header.tsx <<'EOF'
import HeaderClient from "@/components/HeaderClient";
import {
  getAuthContext,
  roleHome,
} from "@/lib/auth";

export default async function Header() {
  const context = await getAuthContext();

  if (!context) {
    return (
      <HeaderClient
        isAuthenticated={false}
        displayName={null}
        accountHref="/login"
        role={null}
      />
    );
  }

  const metadataName =
    typeof context.user.user_metadata?.full_name ===
    "string"
      ? context.user.user_metadata.full_name.trim()
      : "";

  const displayName =
    context.profile?.full_name?.trim() ||
    metadataName ||
    context.user.email?.split("@")[0] ||
    "حسابي";

  return (
    <HeaderClient
      isAuthenticated
      displayName={displayName}
      accountHref={roleHome(context.role)}
      role={context.role}
    />
  );
}
EOF

# =========================================================
# components/HeaderClient.tsx
# =========================================================

cat > components/HeaderClient.tsx <<'EOF'
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
EOF

# =========================================================
# app/account/page.tsx
# =========================================================

cat > app/account/page.tsx <<'EOF'
import type { Metadata } from "next";
import Link from "next/link";
import {
  AlertTriangle,
  BadgeCheck,
  Building2,
  Mail,
  Phone,
  ShieldCheck,
  Store,
  UserRound,
} from "lucide-react";

import {
  requireUser,
  roleLabel,
} from "@/lib/auth";

export const metadata: Metadata = {
  title: "حسابي",
};

type AccountPageProps = {
  searchParams: Promise<{
    error?: string;
  }>;
};

export default async function AccountPage({
  searchParams,
}: AccountPageProps) {
  const context = await requireUser();
  const params = await searchParams;

  const fullName =
    context.profile?.full_name ||
    (typeof context.user.user_metadata
      ?.full_name === "string"
      ? context.user.user_metadata.full_name
      : null) ||
    "مستخدم دليل عدن";

  return (
    <section className="min-h-[calc(100vh-72px)] bg-surface py-10 sm:py-16">
      <div className="container-shell">
        <div className="mx-auto max-w-4xl">
          {params.error ===
          "merchant_required" ? (
            <div className="mb-5 flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-amber-800">
              <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />
              <p className="text-sm leading-7">
                لوحة التاجر متاحة للحسابات التي
                تمتلك صلاحية تاجر. يمكنك تقديم
                نشاط تجاري للمراجعة، ويتم اعتماد
                صلاحيات التاجر وفق إجراءات الإدارة.
              </p>
            </div>
          ) : null}

          {params.error === "admin_required" ? (
            <div className="mb-5 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700">
              <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0" />
              <p className="text-sm leading-7">
                ليس لديك صلاحية للوصول إلى لوحة
                الإدارة.
              </p>
            </div>
          ) : null}

          <div className="surface-card overflow-hidden">
            <div className="bg-gradient-to-l from-brand-950 to-brand-800 px-6 py-8 text-white sm:px-8">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10">
                    <UserRound className="h-6 w-6" />
                  </div>

                  <h1 className="mt-5 text-2xl font-black">
                    حسابي
                  </h1>

                  <p className="mt-2 text-sm leading-7 text-white/70">
                    بيانات حسابك وصلاحيتك الحالية
                    في دليل عدن التجاري.
                  </p>
                </div>

                <span className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-extrabold">
                  {roleLabel(context.role)}
                </span>
              </div>
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
                      {context.user.email}
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-border-soft bg-white p-5">
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-brand-700" />

                  <div>
                    <p className="text-xs text-slate-400">
                      الهاتف
                    </p>

                    <p className="mt-1 font-bold text-slate-900">
                      {context.profile?.phone ||
                        "غير مضاف"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-border-soft bg-white p-5">
                <div className="flex items-center gap-3">
                  <BadgeCheck className="h-5 w-5 text-brand-700" />

                  <div>
                    <p className="text-xs text-slate-400">
                      نوع الحساب
                    </p>

                    <p className="mt-1 font-extrabold text-slate-900">
                      {roleLabel(context.role)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="sm:col-span-2">
                {context.role === "merchant" ? (
                  <Link
                    href="/dashboard"
                    className="flex min-h-20 items-center justify-between rounded-2xl border border-brand-100 bg-brand-50 p-5 text-brand-900 transition hover:border-brand-200"
                  >
                    <div>
                      <p className="font-black">
                        لوحة التاجر
                      </p>

                      <p className="mt-1 text-sm text-brand-700/70">
                        إدارة نشاطك ومنتجاتك
                        وعروضك وإحصائياتك.
                      </p>
                    </div>

                    <Store className="h-6 w-6" />
                  </Link>
                ) : null}

                {context.role === "admin" ? (
                  <Link
                    href="/admin"
                    className="flex min-h-20 items-center justify-between rounded-2xl border border-amber-200 bg-amber-50 p-5 text-amber-900 transition hover:border-amber-300"
                  >
                    <div>
                      <p className="font-black">
                        لوحة الإدارة
                      </p>

                      <p className="mt-1 text-sm text-amber-700/70">
                        إدارة المنصة والمستخدمين
                        والمتاجر والطلبات.
                      </p>
                    </div>

                    <ShieldCheck className="h-6 w-6" />
                  </Link>
                ) : null}

                {context.role === "customer" ? (
                  <Link
                    href="/add-business"
                    className="flex min-h-20 items-center justify-between rounded-2xl border border-brand-100 bg-brand-50 p-5 text-brand-900 transition hover:border-brand-200"
                  >
                    <div>
                      <p className="font-black">
                        أضف نشاطك التجاري
                      </p>

                      <p className="mt-1 text-sm text-brand-700/70">
                        قدم بيانات نشاطك للمراجعة
                        والاعتماد.
                      </p>
                    </div>

                    <Building2 className="h-6 w-6" />
                  </Link>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
EOF

# =========================================================
# app/dashboard/page.tsx
# Merchant dashboard guard
# =========================================================

cat > app/dashboard/page.tsx <<'EOF'
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import {
  BarChart3,
  Building2,
  Eye,
  MessageCircle,
  Package,
  Star,
  Store,
  Tag,
} from "lucide-react";

import {
  requireMerchant,
} from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "لوحة التاجر",
};

export default async function DashboardPage() {
  const context = await requireMerchant();

  if (context.role === "admin") {
    redirect("/admin");
  }

  const supabase = await createClient();

  const {
    data: businesses,
    error,
  } = await supabase
    .from("businesses")
    .select(
      `
        id,
        name_ar,
        slug,
        status,
        is_verified,
        is_featured,
        average_rating,
        reviews_count,
        views_count,
        created_at
      `,
    )
    .eq("owner_id", context.user.id)
    .order("created_at", {
      ascending: false,
    });

  if (error) {
    console.error(
      "Merchant businesses query failed:",
      error.message,
    );
  }

  const business =
    businesses?.[0] ?? null;

  return (
    <section className="min-h-[calc(100vh-72px)] bg-surface py-8 sm:py-12">
      <div className="container-shell">
        <div className="flex flex-col gap-6">
          <div>
            <p className="text-sm font-extrabold text-brand-700">
              لوحة التاجر
            </p>

            <h1 className="mt-1 text-3xl font-black text-slate-950">
              مرحبًا،{" "}
              {context.profile?.full_name ||
                "صاحب النشاط"}
            </h1>

            <p className="mt-2 text-sm leading-7 text-slate-500">
              إدارة نشاطك التجاري ومتابعة أدائه
              من مكان واحد.
            </p>
          </div>

          {!business ? (
            <div className="surface-card p-8 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50 text-brand-800">
                <Building2 className="h-7 w-7" />
              </div>

              <h2 className="mt-5 text-xl font-black text-slate-900">
                لا يوجد نشاط مرتبط بالحساب
              </h2>

              <p className="mx-auto mt-2 max-w-md text-sm leading-7 text-slate-500">
                عند إضافة نشاط واعتماده سيظهر
                هنا لإدارته. لا يمكن لهذه الصفحة
                الوصول إلى نشاط يملكه مستخدم آخر.
              </p>
            </div>
          ) : (
            <>
              <div className="surface-card p-6">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 text-brand-800">
                      <Store className="h-6 w-6" />
                    </div>

                    <div>
                      <h2 className="font-black text-slate-950">
                        {business.name_ar}
                      </h2>

                      <p className="mt-1 text-xs text-slate-400">
                        الحالة:{" "}
                        {business.status}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    {business.is_verified ? (
                      <span className="rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-extrabold text-emerald-700">
                        موثق
                      </span>
                    ) : null}

                    {business.is_featured ? (
                      <span className="rounded-full bg-amber-50 px-3 py-1.5 text-xs font-extrabold text-amber-700">
                        مميز
                      </span>
                    ) : null}
                  </div>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="surface-card p-5">
                  <Eye className="h-5 w-5 text-brand-700" />

                  <p className="mt-4 text-2xl font-black">
                    {business.views_count ?? 0}
                  </p>

                  <p className="mt-1 text-xs text-slate-400">
                    مشاهدات الصفحة
                  </p>
                </div>

                <div className="surface-card p-5">
                  <Star className="h-5 w-5 text-brand-700" />

                  <p className="mt-4 text-2xl font-black">
                    {business.average_rating ?? 0}
                  </p>

                  <p className="mt-1 text-xs text-slate-400">
                    متوسط التقييم
                  </p>
                </div>

                <div className="surface-card p-5">
                  <MessageCircle className="h-5 w-5 text-brand-700" />

                  <p className="mt-4 text-2xl font-black">
                    {business.reviews_count ?? 0}
                  </p>

                  <p className="mt-1 text-xs text-slate-400">
                    التقييمات
                  </p>
                </div>

                <div className="surface-card p-5">
                  <BarChart3 className="h-5 w-5 text-brand-700" />

                  <p className="mt-4 text-lg font-black">
                    {business.status}
                  </p>

                  <p className="mt-1 text-xs text-slate-400">
                    حالة النشاط
                  </p>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div className="surface-card p-6">
                  <Package className="h-6 w-6 text-brand-700" />
                  <h3 className="mt-4 font-black">
                    المنتجات
                  </h3>
                  <p className="mt-2 text-sm leading-7 text-slate-500">
                    إدارة منتجات النشاط ستُربط
                    بالمرحلة التالية.
                  </p>
                </div>

                <div className="surface-card p-6">
                  <Tag className="h-6 w-6 text-brand-700" />
                  <h3 className="mt-4 font-black">
                    العروض
                  </h3>
                  <p className="mt-2 text-sm leading-7 text-slate-500">
                    إضافة وإدارة العروض الخاصة
                    بالنشاط.
                  </p>
                </div>

                <div className="surface-card p-6">
                  <BarChart3 className="h-6 w-6 text-brand-700" />
                  <h3 className="mt-4 font-black">
                    الإحصائيات
                  </h3>
                  <p className="mt-2 text-sm leading-7 text-slate-500">
                    WhatsApp والاتصال والمشاركة
                    والمشاهدات.
                  </p>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
EOF

# =========================================================
# app/admin/page.tsx
# Admin only
# =========================================================

cat > app/admin/page.tsx <<'EOF'
import type { Metadata } from "next";
import {
  BadgeCheck,
  Building2,
  FileWarning,
  Package,
  ShieldCheck,
  Star,
  Store,
  Tag,
  Users,
} from "lucide-react";

import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "لوحة الإدارة",
};

export default async function AdminPage() {
  await requireAdmin();

  const supabase = await createClient();

  const [
    businessesResult,
    pendingResult,
    productsResult,
    offersResult,
    reviewsResult,
    reportsResult,
  ] = await Promise.all([
    supabase
      .from("businesses")
      .select("*", {
        count: "exact",
        head: true,
      }),

    supabase
      .from("businesses")
      .select("*", {
        count: "exact",
        head: true,
      })
      .eq("status", "pending"),

    supabase
      .from("products")
      .select("*", {
        count: "exact",
        head: true,
      }),

    supabase
      .from("offers")
      .select("*", {
        count: "exact",
        head: true,
      }),

    supabase
      .from("reviews")
      .select("*", {
        count: "exact",
        head: true,
      }),

    supabase
      .from("reports")
      .select("*", {
        count: "exact",
        head: true,
      }),
  ]);

  const stats = [
    {
      label: "الأنشطة",
      value: businessesResult.count ?? 0,
      icon: Building2,
    },
    {
      label: "طلبات معلقة",
      value: pendingResult.count ?? 0,
      icon: Store,
    },
    {
      label: "المنتجات",
      value: productsResult.count ?? 0,
      icon: Package,
    },
    {
      label: "العروض",
      value: offersResult.count ?? 0,
      icon: Tag,
    },
    {
      label: "التقييمات",
      value: reviewsResult.count ?? 0,
      icon: Star,
    },
    {
      label: "البلاغات",
      value: reportsResult.count ?? 0,
      icon: FileWarning,
    },
  ];

  return (
    <section className="min-h-[calc(100vh-72px)] bg-slate-50 py-8 sm:py-12">
      <div className="container-shell">
        <div className="flex flex-col gap-7">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-amber-700">
                <ShieldCheck className="h-5 w-5" />
                <p className="text-sm font-extrabold">
                  إدارة المنصة
                </p>
              </div>

              <h1 className="mt-2 text-3xl font-black text-slate-950">
                لوحة الإدارة
              </h1>

              <p className="mt-2 text-sm leading-7 text-slate-500">
                هذه الصفحة لا يمكن فتحها إلا
                لحساب role = admin.
              </p>
            </div>

            <div className="flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-2 text-xs font-extrabold text-amber-800">
              <BadgeCheck className="h-4 w-4" />
              Admin
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {stats.map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.label}
                  className="surface-card p-6"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-bold text-slate-500">
                        {item.label}
                      </p>

                      <p className="mt-3 text-3xl font-black text-slate-950">
                        {item.value}
                      </p>
                    </div>

                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-800">
                      <Icon className="h-5 w-5" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {[
              {
                title: "المستخدمون",
                description:
                  "إدارة العملاء والتجار والصلاحيات.",
                icon: Users,
              },
              {
                title: "طلبات الأنشطة",
                description:
                  "مراجعة وقبول ورفض الأنشطة الجديدة.",
                icon: Store,
              },
              {
                title: "التوثيق والتمييز",
                description:
                  "توثيق المتاجر وإدارة الظهور المميز.",
                icon: BadgeCheck,
              },
            ].map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.title}
                  className="surface-card p-6"
                >
                  <Icon className="h-6 w-6 text-brand-700" />

                  <h2 className="mt-4 font-black text-slate-950">
                    {item.title}
                  </h2>

                  <p className="mt-2 text-sm leading-7 text-slate-500">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
EOF

echo ""
echo "=========================================="
echo " TypeScript"
echo "=========================================="

npm run typecheck

echo ""
echo "=========================================="
echo " Production Build"
echo "=========================================="

npm run build

echo ""
echo "=========================================="
echo " المرحلة الرابعة نجحت"
echo "=========================================="
echo ""
echo "تمت إضافة:"
echo "- lib/auth.ts"
echo "- قراءة role من profiles"
echo "- /account للعملاء"
echo "- /dashboard للتاجر فقط"
echo "- /admin للمدير فقط"
echo "- Header حسب الصلاحية"
echo "- ربط نشاط التاجر بواسطة owner_id"
echo ""
echo "لم يتم تعديل قاعدة البيانات."
echo "لم يتم استخدام service_role."
echo ""