import type { Metadata } from "next";
import Link from "next/link";
import { Building2, MapPin, Search, Star } from "lucide-react";

import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "دليل الأعمال" };

type Props = { searchParams: Promise<{ category?: string; area?: string }> };

export default async function BusinessesPage({ searchParams }: Props) {
  const params = await searchParams;
  const supabase = await createClient();
  const [{ data: businesses }, { data: categories }, { data: areas }] = await Promise.all([
    supabase.from("businesses").select("id, name_ar, slug, description, address, status, is_verified, is_featured, average_rating, reviews_count, category_id, area_id").eq("status", "approved").order("is_featured", { ascending: false }).order("name_ar"),
    supabase.from("categories").select("id, name_ar, slug").eq("is_active", true).order("sort_order").order("name_ar"),
    supabase.from("areas").select("id, name_ar").eq("is_active", true).order("name_ar"),
  ]);
  const category = (categories ?? []).find((item) => item.slug === params.category);
  const area = (areas ?? []).find((item) => item.name_ar === params.area || item.id === params.area);
  const items = (businesses ?? []).filter((business) => (!category || business.category_id === category.id) && (!area || business.area_id === area.id));
  const categoryName = new Map((categories ?? []).map((item) => [item.id, item.name_ar]));
  const areaName = new Map((areas ?? []).map((item) => [item.id, item.name_ar]));

  return <section className="min-h-[calc(100vh-72px)] bg-surface py-10 sm:py-14"><div className="container-shell"><div className="flex flex-wrap items-end justify-between gap-5"><div><p className="text-sm font-extrabold text-brand-700">دليل عدن التجاري</p><h1 className="mt-2 text-3xl font-black text-slate-950">الأنشطة المعتمدة</h1><p className="mt-2 text-sm leading-7 text-slate-500">اكتشف الأنشطة التي تمت مراجعتها واعتمادها من الإدارة.</p></div><Link href="/search" className="inline-flex h-11 items-center gap-2 rounded-xl border border-border-soft bg-white px-4 text-sm font-extrabold text-slate-700"><Search className="h-4 w-4" /> البحث</Link></div>
    <div className="mt-7 flex flex-wrap gap-2">{(categories ?? []).map((item) => <Link key={item.id} href={`/businesses?category=${encodeURIComponent(item.slug)}`} className={`rounded-full border px-4 py-2 text-sm font-bold ${item.slug === params.category ? "border-brand-600 bg-brand-700 text-white" : "border-border-soft bg-white text-slate-700"}`}>{item.name_ar}</Link>)}</div>
    {items.length ? <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">{items.map((business) => <article key={business.id} className="surface-card overflow-hidden"><Link href={`/business/${encodeURIComponent(business.slug)}`} className="block"><div className="flex aspect-[16/7] items-center justify-center bg-gradient-to-br from-brand-950 via-brand-800 to-brand-600"><Building2 className="h-14 w-14 text-white/30" /></div><div className="p-5"><div className="flex items-start justify-between gap-3"><div><h2 className="font-black text-slate-950">{business.name_ar}</h2><p className="mt-1 text-sm font-bold text-brand-700">{categoryName.get(business.category_id) ?? "نشاط تجاري"}</p></div>{business.is_verified ? <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-extrabold text-emerald-700">موثق</span> : null}</div>{business.description ? <p className="mt-3 line-clamp-2 text-sm leading-7 text-slate-500">{business.description}</p> : null}<div className="mt-4 flex items-center justify-between border-t border-border-soft pt-4 text-sm text-slate-500"><span className="inline-flex items-center gap-1.5"><MapPin className="h-4 w-4 text-brand-600" />{areaName.get(business.area_id) ?? business.address ?? "عدن"}</span><span className="inline-flex items-center gap-1"><Star className="h-4 w-4 fill-gold-500 text-gold-500" />{Number(business.average_rating ?? 0).toFixed(1)}</span></div></div></Link></article>)}</div> : <div className="surface-card mt-8 p-12 text-center"><Building2 className="mx-auto h-10 w-10 text-brand-300" /><h2 className="mt-4 font-black text-slate-900">لا توجد أنشطة مطابقة</h2><p className="mt-2 text-sm text-slate-500">جرّب تصنيفًا أو منطقة أخرى.</p></div>}
  </div></section>;
}