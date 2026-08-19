import type { Metadata } from "next";
import {
  AlertTriangle,
  Building2,
  CheckCircle2,
  MapPin,
  Phone,
  Store,
  Tag,
} from "lucide-react";

import { requireUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

import {
  createBusiness,
} from "./actions";

export const metadata: Metadata = {
  title: "أضف نشاطك التجاري",
};

type AddBusinessPageProps = {
  searchParams: Promise<{
    error?: string;
    submitted?: string;
  }>;
};

function errorMessage(
  error?: string,
): string | null {
  if (!error) {
    return null;
  }

  if (error === "name_required") {
    return "اكتب اسم النشاط التجاري.";
  }

  if (error === "city_required") {
    return "اختر المدينة.";
  }

  return decodeURIComponent(error);
}

export default async function AddBusinessPage({
  searchParams,
}: AddBusinessPageProps) {
  await requireUser();

  const params =
    await searchParams;

  const supabase =
    await createClient();

  const [
    citiesResult,
    areasResult,
    categoriesResult,
  ] = await Promise.all([
    supabase
      .from("cities")
      .select(
        "id, name_ar",
      )
      .eq("is_active", true)
      .order("name_ar"),

    supabase
      .from("areas")
      .select(
        "id, city_id, name_ar",
      )
      .eq("is_active", true)
      .order("name_ar"),

    supabase
      .from("categories")
      .select(
        "id, name_ar",
      )
      .eq("is_active", true)
      .order("sort_order")
      .order("name_ar"),
  ]);

  const cities =
    citiesResult.data ?? [];

  const areas =
    areasResult.data ?? [];

  const categories =
    categoriesResult.data ?? [];

  const message =
    errorMessage(params.error);

  if (params.submitted) {
    return (
      <section className="min-h-[calc(100vh-72px)] bg-surface py-12">
        <div className="container-shell">
          <div className="mx-auto max-w-2xl">
            <div className="surface-card p-8 text-center sm:p-12">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
                <CheckCircle2 className="h-8 w-8" />
              </div>

              <h1 className="mt-6 text-2xl font-black text-slate-950">
                تم إرسال نشاطك للمراجعة
              </h1>

              <p className="mx-auto mt-3 max-w-lg text-sm leading-8 text-slate-500">
                تم حفظ النشاط بحالة
                {" "}
                <strong>
                  pending
                </strong>
                {" "}
                ولن يظهر للعامة حتى تتم
                مراجعته واعتماده من الإدارة.
              </p>

              <div className="mt-7 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm leading-7 text-amber-800">
                بعد الاعتماد ستصبح صلاحية
                حساب صاحب النشاط
                {" "}
                <strong>
                  تاجر
                </strong>
                {" "}
                وستفتح له لوحة التاجر.
              </div>

              <a
                href="/account"
                className="mt-7 inline-flex h-12 items-center justify-center rounded-xl bg-brand-800 px-6 font-extrabold text-white"
              >
                العودة إلى حسابي
              </a>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-[calc(100vh-72px)] bg-surface py-8 sm:py-12">
      <div className="container-shell">
        <div className="mx-auto max-w-3xl">
          <div className="mb-6">
            <p className="text-sm font-extrabold text-brand-700">
              دليل عدن التجاري
            </p>

            <h1 className="mt-2 text-3xl font-black text-slate-950">
              أضف نشاطك التجاري
            </h1>

            <p className="mt-3 text-sm leading-7 text-slate-500">
              أرسل بيانات نشاطك للمراجعة.
              لن يظهر النشاط للعامة قبل
              اعتماده من الإدارة.
            </p>
          </div>

          {message ? (
            <div className="mb-5 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700">
              <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />

              <p className="text-sm leading-7">
                {message}
              </p>
            </div>
          ) : null}

          <form
            action={createBusiness}
            className="surface-card overflow-hidden"
          >
            <div className="bg-gradient-to-l from-brand-950 to-brand-800 px-6 py-7 text-white sm:px-8">
              <Building2 className="h-7 w-7" />

              <h2 className="mt-4 text-xl font-black">
                بيانات النشاط
              </h2>

              <p className="mt-2 text-sm leading-7 text-white/65">
                أدخل المعلومات الأساسية
                بدقة.
              </p>
            </div>

            <div className="grid gap-5 p-6 sm:p-8">
              <div>
                <label
                  htmlFor="name_ar"
                  className="mb-2 block text-sm font-extrabold text-slate-700"
                >
                  اسم النشاط التجاري *
                </label>

                <div className="relative">
                  <Store className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-brand-700" />

                  <input
                    id="name_ar"
                    name="name_ar"
                    required
                    placeholder="مثال: متجر عدن"
                    className="h-13 w-full rounded-xl border border-border-soft bg-white pr-12 pl-4 outline-none transition focus:border-brand-400"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="description"
                  className="mb-2 block text-sm font-extrabold text-slate-700"
                >
                  وصف النشاط
                </label>

                <textarea
                  id="description"
                  name="description"
                  rows={5}
                  placeholder="عرّف العملاء بنشاطك وخدماتك..."
                  className="w-full resize-y rounded-xl border border-border-soft bg-white p-4 outline-none transition focus:border-brand-400"
                />
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="city_id"
                    className="mb-2 block text-sm font-extrabold text-slate-700"
                  >
                    المدينة *
                  </label>

                  <div className="relative">
                    <MapPin className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-brand-700" />

                    <select
                      id="city_id"
                      name="city_id"
                      required
                      defaultValue=""
                      className="h-13 w-full appearance-none rounded-xl border border-border-soft bg-white pr-12 pl-4 outline-none focus:border-brand-400"
                    >
                      <option
                        value=""
                        disabled
                      >
                        اختر المدينة
                      </option>

                      {cities.map(
                        (city) => (
                          <option
                            key={city.id}
                            value={city.id}
                          >
                            {city.name_ar}
                          </option>
                        ),
                      )}
                    </select>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="area_id"
                    className="mb-2 block text-sm font-extrabold text-slate-700"
                  >
                    المنطقة
                  </label>

                  <select
                    id="area_id"
                    name="area_id"
                    defaultValue=""
                    className="h-13 w-full rounded-xl border border-border-soft bg-white px-4 outline-none focus:border-brand-400"
                  >
                    <option value="">
                      بدون تحديد
                    </option>

                    {areas.map(
                      (area) => (
                        <option
                          key={area.id}
                          value={area.id}
                        >
                          {area.name_ar}
                        </option>
                      ),
                    )}
                  </select>

                  <p className="mt-2 text-xs leading-6 text-slate-400">
                    سنجعل فلترة المناطق حسب
                    المدينة تفاعلية في مرحلة
                    تحسين النموذج.
                  </p>
                </div>
              </div>

              <div>
                <label
                  htmlFor="category_id"
                  className="mb-2 block text-sm font-extrabold text-slate-700"
                >
                  التصنيف
                </label>

                <div className="relative">
                  <Tag className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-brand-700" />

                  <select
                    id="category_id"
                    name="category_id"
                    defaultValue=""
                    className="h-13 w-full rounded-xl border border-border-soft bg-white pr-12 pl-4 outline-none focus:border-brand-400"
                  >
                    <option value="">
                      اختر التصنيف
                    </option>

                    {categories.map(
                      (category) => (
                        <option
                          key={category.id}
                          value={category.id}
                        >
                          {category.name_ar}
                        </option>
                      ),
                    )}
                  </select>
                </div>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="phone"
                    className="mb-2 block text-sm font-extrabold text-slate-700"
                  >
                    رقم الهاتف
                  </label>

                  <div className="relative">
                    <Phone className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-brand-700" />

                    <input
                      id="phone"
                      name="phone"
                      dir="ltr"
                      className="h-13 w-full rounded-xl border border-border-soft bg-white pr-12 pl-4 text-left outline-none focus:border-brand-400"
                      placeholder="77xxxxxxx"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="whatsapp"
                    className="mb-2 block text-sm font-extrabold text-slate-700"
                  >
                    واتساب
                  </label>

                  <input
                    id="whatsapp"
                    name="whatsapp"
                    dir="ltr"
                    className="h-13 w-full rounded-xl border border-border-soft bg-white px-4 text-left outline-none focus:border-brand-400"
                    placeholder="96777xxxxxxx"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="address"
                  className="mb-2 block text-sm font-extrabold text-slate-700"
                >
                  العنوان
                </label>

                <input
                  id="address"
                  name="address"
                  className="h-13 w-full rounded-xl border border-border-soft bg-white px-4 outline-none focus:border-brand-400"
                  placeholder="مثال: المنصورة، شارع التسعين"
                />
              </div>

              <div className="mt-2 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm leading-7 text-amber-800">
                النشاط سيُرسل بحالة
                {" "}
                <strong>
                  pending
                </strong>
                {" "}
                تلقائيًا. لا يستطيع المستخدم
                اعتماد نشاطه بنفسه.
              </div>

              <button
                type="submit"
                className="mt-2 flex h-13 items-center justify-center rounded-xl bg-brand-800 px-6 font-extrabold text-white transition hover:bg-brand-900"
              >
                إرسال النشاط للمراجعة
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
