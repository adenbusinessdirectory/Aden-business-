import type { Metadata } from "next";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowRight,
  Building2,
  CheckCircle2,
  Clock3,
  Mail,
  MapPin,
  ShieldCheck,
  XCircle,
} from "lucide-react";

import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

import {
  approveBusiness,
  rejectBusiness,
} from "./actions";

export const metadata: Metadata = {
  title: "طلبات الأنشطة",
};

type AdminBusinessesPageProps = {
  searchParams: Promise<{
    error?: string;
    success?: string;
  }>;
};

export default async function AdminBusinessesPage({
  searchParams,
}: AdminBusinessesPageProps) {
  await requireAdmin();

  const params =
    await searchParams;

  const supabase =
    await createClient();

  const {
    data: businesses,
    error,
  } = await supabase
    .from("businesses")
    .select(
      `
        id,
        owner_id,
        name_ar,
        description,
        phone,
        whatsapp,
        address,
        status,
        rejection_reason,
        created_at
      `,
    )
    .order(
      "created_at",
      {
        ascending: false,
      },
    );

  if (error) {
    console.error(
      "Admin businesses query error:",
      error,
    );
  }

  const items =
    businesses ?? [];

  return (
    <section className="min-h-[calc(100vh-72px)] bg-slate-50 py-8 sm:py-12">
      <div className="container-shell">
        <div className="flex flex-col gap-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-amber-700">
                <ShieldCheck className="h-5 w-5" />

                <span className="text-sm font-extrabold">
                  لوحة الإدارة
                </span>
              </div>

              <h1 className="mt-2 text-3xl font-black text-slate-950">
                طلبات الأنشطة التجارية
              </h1>

              <p className="mt-2 text-sm leading-7 text-slate-500">
                مراجعة الأنشطة واعتمادها
                أو رفضها.
              </p>
            </div>

            <Link
              href="/admin"
              className="flex h-11 items-center gap-2 rounded-xl border border-border-soft bg-white px-4 text-sm font-extrabold"
            >
              <ArrowRight className="h-4 w-4" />
              لوحة الإدارة
            </Link>
          </div>

          {params.success ===
          "approved" ? (
            <div className="flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-800">
              <CheckCircle2 className="h-5 w-5" />
              تم اعتماد النشاط وتحويل صاحبه
              إلى تاجر.
            </div>
          ) : null}

          {params.success ===
          "rejected" ? (
            <div className="flex items-center gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700">
              <XCircle className="h-5 w-5" />
              تم رفض النشاط.
            </div>
          ) : null}

          {params.error ? (
            <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700">
              <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />

              <p className="break-all text-sm leading-7">
                {decodeURIComponent(
                  params.error,
                )}
              </p>
            </div>
          ) : null}

          {items.length === 0 ? (
            <div className="surface-card p-10 text-center">
              <Building2 className="mx-auto h-8 w-8 text-brand-700" />

              <h2 className="mt-4 font-black">
                لا توجد أنشطة حتى الآن
              </h2>
            </div>
          ) : (
            <div className="grid gap-5">
              {items.map(
                (business) => (
                  <article
                    key={business.id}
                    className="surface-card overflow-hidden"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-4 border-b border-border-soft p-6">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h2 className="text-xl font-black text-slate-950">
                            {business.name_ar}
                          </h2>

                          {business.status ===
                          "pending" ? (
                            <span className="flex items-center gap-1 rounded-full bg-amber-50 px-3 py-1 text-xs font-extrabold text-amber-700">
                              <Clock3 className="h-3.5 w-3.5" />
                              قيد المراجعة
                            </span>
                          ) : null}

                          {business.status ===
                          "approved" ? (
                            <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-extrabold text-emerald-700">
                              معتمد
                            </span>
                          ) : null}

                          {business.status ===
                          "rejected" ? (
                            <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-extrabold text-red-700">
                              مرفوض
                            </span>
                          ) : null}
                        </div>

                        {business.description ? (
                          <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-500">
                            {business.description}
                          </p>
                        ) : null}
                      </div>

                      <span className="text-xs text-slate-400">
                        {new Date(
                          business.created_at,
                        ).toLocaleDateString(
                          "ar",
                        )}
                      </span>
                    </div>

                    <div className="grid gap-3 p-6 text-sm sm:grid-cols-2 lg:grid-cols-3">
                      {business.phone ? (
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-brand-700" />
                          {business.phone}
                        </div>
                      ) : null}

                      {business.address ? (
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-brand-700" />
                          {business.address}
                        </div>
                      ) : null}

                      <div className="truncate text-xs text-slate-400">
                        owner:
                        {" "}
                        {business.owner_id}
                      </div>
                    </div>

                    {business.status ===
                    "pending" ? (
                      <div className="grid gap-4 border-t border-border-soft bg-slate-50/70 p-6 lg:grid-cols-2">
                        <form
                          action={
                            approveBusiness
                          }
                        >
                          <input
                            type="hidden"
                            name="business_id"
                            value={
                              business.id
                            }
                          />

                          <input
                            type="hidden"
                            name="owner_id"
                            value={
                              business.owner_id
                            }
                          />

                          <button
                            type="submit"
                            className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-emerald-700 px-5 font-extrabold text-white"
                          >
                            <CheckCircle2 className="h-5 w-5" />
                            اعتماد النشاط
                          </button>
                        </form>

                        <form
                          action={
                            rejectBusiness
                          }
                          className="grid gap-2"
                        >
                          <input
                            type="hidden"
                            name="business_id"
                            value={
                              business.id
                            }
                          />

                          <input
                            name="rejection_reason"
                            placeholder="سبب الرفض"
                            className="h-11 rounded-xl border border-border-soft bg-white px-4 outline-none focus:border-red-300"
                          />

                          <button
                            type="submit"
                            className="flex h-12 items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-5 font-extrabold text-red-700"
                          >
                            <XCircle className="h-5 w-5" />
                            رفض النشاط
                          </button>
                        </form>
                      </div>
                    ) : null}

                    {business.status ===
                      "rejected" &&
                    business.rejection_reason ? (
                      <div className="border-t border-red-100 bg-red-50 p-5 text-sm leading-7 text-red-700">
                        سبب الرفض:
                        {" "}
                        {
                          business.rejection_reason
                        }
                      </div>
                    ) : null}
                  </article>
                ),
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
