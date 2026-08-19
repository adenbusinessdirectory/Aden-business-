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
