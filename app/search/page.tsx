import type { Metadata } from "next";
import Link from "next/link";
import { Building2, MapPin, Package, Search, Tag } from "lucide-react";

import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "البحث" };

type Props = { searchParams: Promise<{ q?: string; area?: string }> };

export default async function SearchPage({ searchParams }: Props) {
  const params = await searchParams;
  const query = (params.q ?? "").trim();
  const supabase = await createClient();
  const [{ data: businesses }, { data: products }, { data: offers }, { data: areas }] = await Promise.all([
    supabase.from("businesses").select("id, name_ar, slug, description, address, area_id, status").eq("status", "approved").order("name_ar"),
    supabase.from("products").select("id, business_id, name_ar, description, price"),
    supabase.from("offers").select("id, business_id, title_ar, description, discount_percentage"),
    supabase.from("areas").select("id, name_ar").eq("is_active", true),
  ]);
  const area = (areas ?? []).find((item) => item.name_ar === params.area || item.id === params.area);
  const matches = (value: string | null | undefined) => !query || value?.toLocaleLowerCase("ar").includes(query.toLocaleLowerCase("ar"));
  const areaMatches = (areaId: string | null, address?: string | null) => !area || areaId === area.id || matches(address);
  const businessItems = (businesses ?? []).filter((business) => areaMatches(business.area_id, business.address) && (matches(business.name_ar) || matches(business.description) || matches(business.address)));
  const businessIds = new Set((businesses ?? []).filter((business) => areaMatches(business.area_id, business.address)).map((business) => business.id));
  const productItems = (products ?? []).filter((product) => businessIds.has(product.business_id) && (matches(product.name_ar) || matches(product.description)));
  const offerItems = (offers ?? []).filter((offer) => businessIds.has(offer.business_id) && (matches(offer.title_ar) || matches(offer.description)));
  const businessMap = new Map((businesses ?? []).map((business) => [business.id, business]));
  const total = businessItems.length + productItems.length + offerItems.length;

  return <section className="min-h-[calc(100vh-72px)] bg-surface py-10 sm:py-14"><div className="container-shell"><div className="mx-auto max-w-5xl"><form action="/search" method="get" className="surface-card flex flex-col gap-3 p-4 sm:flex-row"><div className="relative flex-1"><Search className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" /><input name="q" defaultValue={query} placeholder="ابحث عن نشاط أو منتج أو عرض" className="h-12 w-full rounded-xl border border-border-soft pr-12 pl-4 outline-none focus:border-brand-400" /></div><select name="area" defaultValue={params.area ?? ""} className="h-12 rounded-xl border border-border-soft px-4 sm:w-48"><option value="">كل المناطق</option>{(areas ?? []).map((item) => <option key={item.id} value={item.id}>{item.name_ar}</option>)}</select><button className="h-12 rounded-xl bg-brand-800 px-6 font-extrabold text-white">بحث</button></form><div className="mt-8"><p className="text-sm font-extrabold text-brand-700">نتائج البحث</p><h1 className="mt-2 text-3xl font-black text-slate-950">{query || params.area ? `نتائج ${query ? `عن «${query}»` : "المنطقة"}` : "اكتشف دليل عدن"}</h1><p className="mt-2 text-sm text-slate-500">{total} نتيجة متاحة من الأنشطة المعتمدة.</p></div>{total ? <div className="mt-8 grid gap-4">{businessItems.map((business) => <Link key={`business-${business.id}`} href={`/business/${encodeURIComponent(business.slug)}`} className="surface-card flex items-start gap-4 p-5"><Building2 className="mt-1 h-6 w-6 shrink-0 text-brand-700" /><div><h2 className="font-black text-slate-950">{business.name_ar}</h2><p className="mt-1 text-sm leading-6 text-slate-500">{business.description ?? business.address ?? "نشاط تجاري معتمد"}</p></div></Link>)}{productItems.map((product) => <div key={`product-${product.id}`} className="surface-card flex items-start gap-4 p-5"><Package className="mt-1 h-6 w-6 shrink-0 text-brand-700" /><div><p className="text-xs font-bold text-brand-700">منتج من {businessMap.get(product.business_id)?.name_ar}</p><h2 className="mt-1 font-black text-slate-950">{product.name_ar}</h2><p className="mt-1 text-sm text-slate-500">{product.description ?? ""}</p></div></div>)}{offerItems.map((offer) => <div key={`offer-${offer.id}`} className="surface-card flex items-start gap-4 p-5"><Tag className="mt-1 h-6 w-6 shrink-0 text-gold-600" /><div><p className="text-xs font-bold text-brand-700">عرض من {businessMap.get(offer.business_id)?.name_ar}</p><h2 className="mt-1 font-black text-slate-950">{offer.title_ar}</h2><p className="mt-1 text-sm text-slate-500">{offer.description ?? ""}</p></div></div>)}</div> : <div className="surface-card mt-8 p-12 text-center"><Search className="mx-auto h-10 w-10 text-brand-300" /><h2 className="mt-4 font-black text-slate-900">لا توجد نتائج</h2><p className="mt-2 text-sm text-slate-500">جرّب كلمات أخرى أو غيّر المنطقة.</p></div>}</div></div></section>;
}