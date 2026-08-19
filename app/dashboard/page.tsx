import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  AlertTriangle,
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

type DashboardPageProps = {
  searchParams: Promise<{
    error?: string;
    success?: string;
  }>;
};

export default async function DashboardPage({
  searchParams,
}: DashboardPageProps) {
  const context = await requireMerchant();
  const params = await searchParams;

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
        rejection_reason,
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

  const otherBusinesses = businesses?.slice(1) ?? [];

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

          {params.success === "updated" ? (
            <div className="flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
              تم تحديث بيانات النشاط وإرسالها للمراجعة من جديد.
            </div>
          ) : null}

          {params.error ? (
            <div className="flex items-center gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              <AlertTriangle className="h-5 w-5" />
              تعذر تنفيذ العملية: {decodeURIComponent(params.error)}
            </div>
          ) : null}

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

                {business.status === "rejected" && business.rejection_reason ? (
                  <div className="mt-5 rounded-xl border border-red-100 bg-red-50 p-4 text-sm leading-7 text-red-700">
                    سبب الرفض: {business.rejection_reason}
                  </div>
                ) : null}

                {business.status !== "approved" ? (
                  <Link
                    href={`/dashboard/edit/${business.id}`}
                    className="mt-5 inline-flex h-11 items-center justify-center rounded-xl bg-brand-800 px-5 text-sm font-extrabold text-white hover:bg-brand-900"
                  >
                    تعديل وإرسال للمراجعة
                  </Link>
                ) : null}
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
                  <Link href="/dashboard/products" className="block">
                  <Package className="h-6 w-6 text-brand-700" />
                  <h3 className="mt-4 font-black">
                    المنتجات
                  </h3>
                  <p className="mt-2 text-sm leading-7 text-slate-500">
                    إدارة منتجات النشاط ستُربط
                    من هنا.
                  </p>
                  </Link>
                </div>

                <div className="surface-card p-6">
                  <Link href="/dashboard/offers" className="block">
                  <Tag className="h-6 w-6 text-brand-700" />
                  <h3 className="mt-4 font-black">
                    العروض
                  </h3>
                  <p className="mt-2 text-sm leading-7 text-slate-500">
                    إضافة وإدارة العروض الخاصة
                    بالنشاط من هنا.
                  </p>
                  </Link>
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

              {otherBusinesses.length > 0 ? (
                <div className="surface-card p-6">
                  <h2 className="text-lg font-black text-slate-950">أنشطة أخرى مرتبطة بالحساب</h2>
                  <div className="mt-4 grid gap-3">
                    {otherBusinesses.map((item) => (
                      <div key={item.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border-soft p-4">
                        <div>
                          <p className="font-extrabold">{item.name_ar}</p>
                          <p className="mt-1 text-xs text-slate-500">الحالة: {item.status}</p>
                        </div>
                        {item.status !== "approved" ? <Link href={`/dashboard/edit/${item.id}`} className="text-sm font-extrabold text-brand-800">تعديل</Link> : null}
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}
            </>
          )}
        </div>
      </div>
    </section>
  );
}
