import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Building2 } from "lucide-react";

import { requireMerchant } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

import { updateBusiness } from "../../actions";

export const metadata: Metadata = { title: "تعديل النشاط" };

type EditBusinessPageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
};

function errorMessage(error?: string) {
  if (error === "name_required") return "اكتب اسم النشاط التجاري.";
  if (error === "city_required") return "اختر المدينة.";
  return error ? decodeURIComponent(error) : null;
}

export default async function EditBusinessPage({
  params,
  searchParams,
}: EditBusinessPageProps) {
  const context = await requireMerchant();
  const { id } = await params;
  const query = await searchParams;
  const supabase = await createClient();

  const [{ data: business }, { data: cities }, { data: areas }, { data: categories }] =
    await Promise.all([
      supabase
        .from("businesses")
        .select("id, name_ar, description, city_id, area_id, category_id, phone, whatsapp, address, status, rejection_reason")
        .eq("id", id)
        .eq("owner_id", context.user.id)
        .single(),
      supabase.from("cities").select("id, name_ar").eq("is_active", true).order("name_ar"),
      supabase.from("areas").select("id, city_id, name_ar").eq("is_active", true).order("name_ar"),
      supabase.from("categories").select("id, name_ar").eq("is_active", true).order("sort_order").order("name_ar"),
    ]);

  if (!business || !["pending", "rejected"].includes(business.status)) {
    return (
      <section className="min-h-[calc(100vh-72px)] bg-surface py-12">
        <div className="container-shell">
          <div className="surface-card mx-auto max-w-2xl p-8 text-center">
            <Building2 className="mx-auto h-10 w-10 text-brand-700" />
            <h1 className="mt-5 text-2xl font-black">لا يمكن تعديل هذا النشاط</h1>
            <p className="mt-3 text-sm leading-7 text-slate-500">يمكن تعديل الأنشطة قيد المراجعة أو المرفوضة فقط.</p>
            <Link href="/dashboard" className="mt-6 inline-flex items-center gap-2 font-extrabold text-brand-800">
              <ArrowRight className="h-4 w-4" /> العودة إلى لوحة التاجر
            </Link>
          </div>
        </div>
      </section>
    );
  }

  const message = errorMessage(query.error);
  return (
    <section className="min-h-[calc(100vh-72px)] bg-surface py-8 sm:py-12">
      <div className="container-shell">
        <div className="mx-auto max-w-3xl">
          <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm font-extrabold text-brand-800">
            <ArrowRight className="h-4 w-4" /> لوحة التاجر
          </Link>
          <h1 className="mt-5 text-3xl font-black text-slate-950">تعديل بيانات النشاط</h1>
          {message ? <p className="mt-4 rounded-xl bg-red-50 p-4 text-sm text-red-700">{message}</p> : null}
          {business.rejection_reason ? <p className="mt-4 rounded-xl bg-amber-50 p-4 text-sm leading-7 text-amber-800">سبب الرفض: {business.rejection_reason}</p> : null}

          <form action={updateBusiness} className="surface-card mt-6 grid gap-5 p-6 sm:p-8">
            <input type="hidden" name="business_id" value={business.id} />
            <label className="grid gap-2 text-sm font-extrabold">اسم النشاط *<input name="name_ar" required defaultValue={business.name_ar} className="h-13 rounded-xl border border-border-soft px-4 outline-none focus:border-brand-400" /></label>
            <label className="grid gap-2 text-sm font-extrabold">الوصف<textarea name="description" rows={4} defaultValue={business.description ?? ""} className="rounded-xl border border-border-soft p-4 outline-none focus:border-brand-400" /></label>
            <div className="grid gap-5 sm:grid-cols-2">
              <label className="grid gap-2 text-sm font-extrabold">المدينة *<select name="city_id" required defaultValue={business.city_id} className="h-13 rounded-xl border border-border-soft px-4 outline-none focus:border-brand-400">{(cities ?? []).map((city) => <option key={city.id} value={city.id}>{city.name_ar}</option>)}</select></label>
              <label className="grid gap-2 text-sm font-extrabold">المنطقة<select name="area_id" defaultValue={business.area_id ?? ""} className="h-13 rounded-xl border border-border-soft px-4 outline-none focus:border-brand-400"><option value="">بدون تحديد</option>{(areas ?? []).map((area) => <option key={area.id} value={area.id}>{area.name_ar}</option>)}</select></label>
            </div>
            <label className="grid gap-2 text-sm font-extrabold">التصنيف<select name="category_id" defaultValue={business.category_id ?? ""} className="h-13 rounded-xl border border-border-soft px-4 outline-none focus:border-brand-400"><option value="">بدون تحديد</option>{(categories ?? []).map((category) => <option key={category.id} value={category.id}>{category.name_ar}</option>)}</select></label>
            <div className="grid gap-5 sm:grid-cols-2"><label className="grid gap-2 text-sm font-extrabold">الهاتف<input name="phone" dir="ltr" defaultValue={business.phone ?? ""} className="h-13 rounded-xl border border-border-soft px-4 text-left outline-none focus:border-brand-400" /></label><label className="grid gap-2 text-sm font-extrabold">واتساب<input name="whatsapp" dir="ltr" defaultValue={business.whatsapp ?? ""} className="h-13 rounded-xl border border-border-soft px-4 text-left outline-none focus:border-brand-400" /></label></div>
            <label className="grid gap-2 text-sm font-extrabold">العنوان<input name="address" defaultValue={business.address ?? ""} className="h-13 rounded-xl border border-border-soft px-4 outline-none focus:border-brand-400" /></label>
            <button type="submit" className="h-13 rounded-xl bg-brand-800 font-extrabold text-white hover:bg-brand-900">حفظ وإرسال للمراجعة</button>
          </form>
        </div>
      </div>
    </section>
  );
}