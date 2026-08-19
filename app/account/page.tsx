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
