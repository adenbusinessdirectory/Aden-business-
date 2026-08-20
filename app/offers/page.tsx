import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Building2, CalendarDays, Tag } from "lucide-react";

import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "العروض" };

export default async function OffersPage() {
  const supabase = await createClient();
  const [{ data: offers }, { data: businesses }] = await Promise.all([
    supabase.from("offers").select("id, business_id, title_ar, description, discount_percentage, starts_at").order("created_at", { ascending: false }),
    supabase.from("businesses").select("id, name_ar, slug").eq("status", "approved"),
  ]);
  const approved = new Map((businesses ?? []).map((business) => [business.id, business]));
  const items = (offers ?? []).filter((offer) => approved.has(offer.business_id));

  return <section className="min-h-[calc(100vh-72px)] bg-surface py-10 sm:py-14"><div className="container-shell"><Link href="/" className="inline-flex items-center gap-2 text-sm font-extrabold text-brand-800"><ArrowRight className="h-4 w-4" /> الرئيسية</Link><div className="mt-5"><p className="text-sm font-extrabold text-brand-700">وفر واستفد</p><h1 className="mt-2 text-3xl font-black text-slate-950">عروض الأنشطة المعتمدة</h1><p className="mt-2 text-sm leading-7 text-slate-500">أحدث العروض المنشورة من الأنشطة التجارية في عدن.</p></div>{items.length ? <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">{items.map((offer) => { const business = approved.get(offer.business_id)!; return <article key={offer.id} className="surface-card overflow-hidden"><div className="flex items-center justify-between bg-brand-950 p-6 text-white"><Tag className="h-8 w-8 text-brand-300" />{offer.discount_percentage !== null && offer.discount_percentage !== undefined ? <strong className="rounded-full bg-gold-500 px-3 py-1 text-sm text-white">خصم {offer.discount_percentage}%</strong> : null}</div><div className="p-6"><Link href={`/business/${encodeURIComponent(business.slug)}`} className="text-sm font-bold text-brand-700">{business.name_ar}</Link><h2 className="mt-2 text-xl font-black text-slate-950">{offer.title_ar}</h2>{offer.description ? <p className="mt-3 text-sm leading-7 text-slate-500">{offer.description}</p> : null}{offer.starts_at ? <p className="mt-4 inline-flex items-center gap-2 text-xs text-slate-400"><CalendarDays className="h-4 w-4" /> يبدأ {new Date(offer.starts_at).toLocaleDateString("ar-YE")}</p> : null}</div></article>; })}</div> : <div className="surface-card mt-8 p-12 text-center"><Tag className="mx-auto h-10 w-10 text-brand-300" /><h2 className="mt-4 font-black">لا توجد عروض منشورة بعد</h2></div>}</div></section>;
}