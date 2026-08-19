import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Package, Pencil, Trash2 } from "lucide-react";

import { requireMerchant } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { createProduct, deleteProduct, updateProduct } from "./actions";

export const metadata: Metadata = { title: "منتجات النشاط" };

type Props = { searchParams: Promise<{ error?: string; success?: string }> };

function notice(value?: string) {
  if (value === "required") return "اسم المنتج والنشاط مطلوبان.";
  if (value === "price") return "أدخل سعرًا صحيحًا.";
  if (value === "business") return "لا تملك صلاحية إدارة هذا النشاط.";
  return value ? decodeURIComponent(value) : null;
}

export default async function ProductsPage({ searchParams }: Props) {
  const context = await requireMerchant();
  const params = await searchParams;
  const supabase = await createClient();
  const [{ data: businesses }, { data: products }] = await Promise.all([
    supabase.from("businesses").select("id, name_ar").eq("owner_id", context.user.id).eq("status", "approved").order("name_ar"),
    supabase.from("products").select("id, business_id, name_ar, description, price").order("created_at", { ascending: false }),
  ]);
  const ownedIds = new Set((businesses ?? []).map((business) => business.id));
  const items = (products ?? []).filter((product) => ownedIds.has(product.business_id));
  const message = notice(params.error);
  const success = params.success === "created" ? "تمت إضافة المنتج." : params.success === "updated" ? "تم تحديث المنتج." : params.success === "deleted" ? "تم حذف المنتج." : null;

  return <section className="min-h-[calc(100vh-72px)] bg-surface py-8 sm:py-12"><div className="container-shell"><div className="mx-auto max-w-5xl">
    <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm font-extrabold text-brand-800"><ArrowRight className="h-4 w-4" /> لوحة التاجر</Link>
    <div className="mt-5 flex flex-wrap items-end justify-between gap-4"><div><p className="text-sm font-extrabold text-brand-700">إدارة النشاط</p><h1 className="mt-2 text-3xl font-black text-slate-950">المنتجات</h1><p className="mt-2 text-sm text-slate-500">أضف منتجاتك لتظهر للعملاء في دليل الأعمال.</p></div><Package className="h-9 w-9 text-brand-700" /></div>
    {message ? <div className="mt-5 rounded-xl bg-red-50 p-4 text-sm text-red-700">{message}</div> : null}{success ? <div className="mt-5 rounded-xl bg-emerald-50 p-4 text-sm text-emerald-800">{success}</div> : null}
    {businesses?.length ? <form action={createProduct} className="surface-card mt-6 grid gap-4 p-6 sm:grid-cols-2"><h2 className="text-lg font-black sm:col-span-2">إضافة منتج</h2><select name="business_id" required className="h-12 rounded-xl border border-border-soft px-4"><option value="">اختر النشاط</option>{businesses.map((business) => <option key={business.id} value={business.id}>{business.name_ar}</option>)}</select><input name="name_ar" required placeholder="اسم المنتج" className="h-12 rounded-xl border border-border-soft px-4" /><input name="price" inputMode="decimal" placeholder="السعر" className="h-12 rounded-xl border border-border-soft px-4" /><input name="description" placeholder="وصف مختصر" className="h-12 rounded-xl border border-border-soft px-4" /><button className="h-12 rounded-xl bg-brand-800 font-extrabold text-white hover:bg-brand-900 sm:col-span-2">إضافة المنتج</button></form> : <div className="surface-card mt-6 p-6 text-sm text-slate-600">يجب اعتماد نشاطك أولًا حتى تتمكن من إدارة المنتجات.</div>}
    <div className="mt-6 grid gap-4">{items.map((product) => <article key={product.id} className="surface-card p-6"><form action={updateProduct} className="grid gap-4 sm:grid-cols-[1fr_1fr_auto] sm:items-end"><input type="hidden" name="product_id" value={product.id} /><select name="business_id" defaultValue={product.business_id} className="h-12 rounded-xl border border-border-soft px-4">{(businesses ?? []).map((business) => <option key={business.id} value={business.id}>{business.name_ar}</option>)}</select><input name="name_ar" required defaultValue={product.name_ar} className="h-12 rounded-xl border border-border-soft px-4" /><input name="price" defaultValue={product.price ?? ""} inputMode="decimal" className="h-12 rounded-xl border border-border-soft px-4" /><input name="description" defaultValue={product.description ?? ""} className="h-12 rounded-xl border border-border-soft px-4 sm:col-span-2" /><button className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-brand-800 px-4 font-extrabold text-white"><Pencil className="h-4 w-4" /> حفظ</button></form><form action={deleteProduct} className="mt-3"><input type="hidden" name="product_id" value={product.id} /><input type="hidden" name="business_id" value={product.business_id} /><button className="inline-flex items-center gap-2 text-sm font-extrabold text-red-700"><Trash2 className="h-4 w-4" /> حذف المنتج</button></form></article>)}</div>
    {!items.length && businesses?.length ? <div className="surface-card mt-6 p-8 text-center text-sm text-slate-500">لا توجد منتجات بعد.</div> : null}
  </div></div></section>;
}