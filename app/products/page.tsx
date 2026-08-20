import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Building2, Package } from "lucide-react";

import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "المنتجات" };

export default async function ProductsPage() {
  const supabase = await createClient();
  const [{ data: products }, { data: businesses }] = await Promise.all([
    supabase.from("products").select("id, business_id, name_ar, description, price").order("created_at", { ascending: false }),
    supabase.from("businesses").select("id, name_ar, slug").eq("status", "approved"),
  ]);
  const approved = new Map((businesses ?? []).map((business) => [business.id, business]));
  const items = (products ?? []).filter((product) => approved.has(product.business_id));

  return <section className="min-h-[calc(100vh-72px)] bg-surface py-10 sm:py-14"><div className="container-shell"><Link href="/" className="inline-flex items-center gap-2 text-sm font-extrabold text-brand-800"><ArrowRight className="h-4 w-4" /> الرئيسية</Link><div className="mt-5"><p className="text-sm font-extrabold text-brand-700">تسوق محليًا</p><h1 className="mt-2 text-3xl font-black text-slate-950">منتجات الأنشطة المعتمدة</h1><p className="mt-2 text-sm leading-7 text-slate-500">منتجات منشورة من أنشطة تمت مراجعتها واعتمادها.</p></div>{items.length ? <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">{items.map((product) => { const business = approved.get(product.business_id)!; return <article key={product.id} className="surface-card overflow-hidden"><div className="flex aspect-square items-center justify-center bg-brand-50"><Package className="h-14 w-14 text-brand-200" /></div><div className="p-4"><Link href={`/business/${encodeURIComponent(business.slug)}`} className="inline-flex items-center gap-1 text-xs font-bold text-brand-700"><Building2 className="h-3.5 w-3.5" />{business.name_ar}</Link><h2 className="mt-2 font-black text-slate-900">{product.name_ar}</h2>{product.description ? <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-500">{product.description}</p> : null}{product.price !== null && product.price !== undefined ? <p className="mt-3 font-black text-brand-800">{Number(product.price).toLocaleString("ar-YE")} ر.ي</p> : null}</div></article>; })}</div> : <div className="surface-card mt-8 p-12 text-center"><Package className="mx-auto h-10 w-10 text-brand-300" /><h2 className="mt-4 font-black">لا توجد منتجات منشورة بعد</h2></div>}</div></section>;
}