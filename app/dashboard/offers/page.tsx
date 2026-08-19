import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Pencil, Tag, Trash2 } from "lucide-react";

import { requireMerchant } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { createOffer, deleteOffer, updateOffer } from "./actions";

export const metadata: Metadata = { title: "عروض النشاط" };
type Props = { searchParams: Promise<{ error?: string; success?: string }> };

function notice(value?: string) {
  if (value === "required") return "عنوان العرض والنشاط مطلوبان.";
  if (value === "discount") return "نسبة الخصم يجب أن تكون بين 0 و100.";
  if (value === "business") return "لا تملك صلاحية إدارة هذا النشاط.";
  return value ? decodeURIComponent(value) : null;
}

export default async function OffersPage({ searchParams }: Props) {
  const context = await requireMerchant();
  const params = await searchParams;
  const supabase = await createClient();
  const [{ data: businesses }, { data: offers }] = await Promise.all([
    supabase.from("businesses").select("id, name_ar").eq("owner_id", context.user.id).eq("status", "approved").order("name_ar"),
    supabase.from("offers").select("id, business_id, title_ar, description, discount_percentage, starts_at").order("created_at", { ascending: false }),
  ]);
  const ownedIds = new Set((businesses ?? []).map((business) => business.id));
  const items = (offers ?? []).filter((offer) => ownedIds.has(offer.business_id));
  const message = notice(params.error);
  const success = params.success === "created" ? "تمت إضافة العرض." : params.success === "updated" ? "تم تحديث العرض." : params.success === "deleted" ? "تم حذف العرض." : null;

  return <section className="min-h-[calc(100vh-72px)] bg-surface py-8 sm:py-12"><div className="container-shell"><div className="mx-auto max-w-5xl">
    <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm font-extrabold text-brand-800"><ArrowRight className="h-4 w-4" /> لوحة التاجر</Link>
    <div className="mt-5 flex flex-wrap items-end justify-between gap-4"><div><p className="text-sm font-extrabold text-brand-700">إدارة النشاط</p><h1 className="mt-2 text-3xl font-black text-slate-950">العروض</h1><p className="mt-2 text-sm text-slate-500">أنشئ عروضًا واضحة وجذابة لعملائك.</p></div><Tag className="h-9 w-9 text-brand-700" /></div>
    {message ? <div className="mt-5 rounded-xl bg-red-50 p-4 text-sm text-red-700">{message}</div> : null}{success ? <div className="mt-5 rounded-xl bg-emerald-50 p-4 text-sm text-emerald-800">{success}</div> : null}
    {businesses?.length ? <form action={createOffer} className="surface-card mt-6 grid gap-4 p-6 sm:grid-cols-2"><h2 className="text-lg font-black sm:col-span-2">إضافة عرض</h2><select name="business_id" required className="h-12 rounded-xl border border-border-soft px-4"><option value="">اختر النشاط</option>{businesses.map((business) => <option key={business.id} value={business.id}>{business.name_ar}</option>)}</select><input name="title_ar" required placeholder="عنوان العرض" className="h-12 rounded-xl border border-border-soft px-4" /><input name="discount_percentage" inputMode="decimal" placeholder="نسبة الخصم %" className="h-12 rounded-xl border border-border-soft px-4" /><input name="starts_at" type="datetime-local" className="h-12 rounded-xl border border-border-soft px-4" /><textarea name="description" rows={3} placeholder="تفاصيل العرض" className="rounded-xl border border-border-soft p-4 sm:col-span-2" /><button className="h-12 rounded-xl bg-brand-800 font-extrabold text-white hover:bg-brand-900 sm:col-span-2">إضافة العرض</button></form> : <div className="surface-card mt-6 p-6 text-sm text-slate-600">يجب اعتماد نشاطك أولًا حتى تتمكن من إدارة العروض.</div>}
    <div className="mt-6 grid gap-4">{items.map((offer) => <article key={offer.id} className="surface-card p-6"><form action={updateOffer} className="grid gap-4 sm:grid-cols-2"><input type="hidden" name="offer_id" value={offer.id} /><select name="business_id" defaultValue={offer.business_id} className="h-12 rounded-xl border border-border-soft px-4">{(businesses ?? []).map((business) => <option key={business.id} value={business.id}>{business.name_ar}</option>)}</select><input name="title_ar" required defaultValue={offer.title_ar} className="h-12 rounded-xl border border-border-soft px-4" /><input name="discount_percentage" defaultValue={offer.discount_percentage ?? ""} inputMode="decimal" placeholder="نسبة الخصم %" className="h-12 rounded-xl border border-border-soft px-4" /><input name="starts_at" type="datetime-local" defaultValue={offer.starts_at ? new Date(offer.starts_at).toISOString().slice(0, 16) : ""} className="h-12 rounded-xl border border-border-soft px-4" /><textarea name="description" rows={3} defaultValue={offer.description ?? ""} className="rounded-xl border border-border-soft p-4 sm:col-span-2" /><button className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-brand-800 font-extrabold text-white"><Pencil className="h-4 w-4" /> حفظ</button></form><form action={deleteOffer} className="mt-3"><input type="hidden" name="offer_id" value={offer.id} /><input type="hidden" name="business_id" value={offer.business_id} /><button className="inline-flex items-center gap-2 text-sm font-extrabold text-red-700"><Trash2 className="h-4 w-4" /> حذف العرض</button></form></article>)}</div>
    {!items.length && businesses?.length ? <div className="surface-card mt-6 p-8 text-center text-sm text-slate-500">لا توجد عروض بعد.</div> : null}
  </div></div></section>;
}