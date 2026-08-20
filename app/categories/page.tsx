import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, FolderTree } from "lucide-react";

import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "التصنيفات" };

export default async function CategoriesPage() {
  const supabase = await createClient();
  const [{ data: categories }, { data: businesses }] = await Promise.all([
    supabase.from("categories").select("id, name_ar, slug").eq("is_active", true).order("sort_order").order("name_ar"),
    supabase.from("businesses").select("category_id").eq("status", "approved"),
  ]);
  const counts = new Map<string, number>();
  (businesses ?? []).forEach((business) => counts.set(business.category_id, (counts.get(business.category_id) ?? 0) + 1));

  return <section className="min-h-[calc(100vh-72px)] bg-surface py-10 sm:py-14"><div className="container-shell"><p className="text-sm font-extrabold text-brand-700">اكتشف حسب المجال</p><h1 className="mt-2 text-3xl font-black text-slate-950">تصنيفات الأعمال</h1><div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">{(categories ?? []).map((category) => <Link key={category.id} href={`/businesses?category=${encodeURIComponent(category.slug)}`} className="surface-card group p-5 transition hover:-translate-y-1 hover:border-brand-200"><FolderTree className="h-7 w-7 text-brand-700" /><h2 className="mt-5 font-black text-slate-950">{category.name_ar}</h2><p className="mt-2 text-sm text-slate-500">{counts.get(category.id) ?? 0} نشاط معتمد</p><span className="mt-5 inline-flex items-center gap-1 text-sm font-extrabold text-brand-700">تصفح <ArrowLeft className="h-4 w-4 transition group-hover:-translate-x-1" /></span></Link>)}</div></div></section>;
}