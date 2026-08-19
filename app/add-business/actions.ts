"use server";

import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

function textValue(
  formData: FormData,
  key: string,
): string {
  const value = formData.get(key);

  return typeof value === "string"
    ? value.trim()
    : "";
}

export async function createBusiness(
  formData: FormData,
) {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect("/login");
  }

  const nameAr = textValue(
    formData,
    "name_ar",
  );

  const description = textValue(
    formData,
    "description",
  );

  const cityId = textValue(
    formData,
    "city_id",
  );

  const areaId = textValue(
    formData,
    "area_id",
  );

  const categoryId = textValue(
    formData,
    "category_id",
  );

  const phone = textValue(
    formData,
    "phone",
  );

  const whatsapp = textValue(
    formData,
    "whatsapp",
  );

  const address = textValue(
    formData,
    "address",
  );

  if (!nameAr) {
    redirect(
      "/add-business?error=name_required",
    );
  }

  if (!cityId) {
    redirect(
      "/add-business?error=city_required",
    );
  }

  /*
   * slug فريد وآمن.
   * لا نعتمد على تحويل الاسم العربي.
   */
  const slug =
    "business-" +
    user.id.slice(0, 8) +
    "-" +
    Date.now().toString(36);

  const payload = {
    owner_id: user.id,
    city_id: cityId,
    area_id: areaId || null,
    category_id:
      categoryId || null,
    name_ar: nameAr,
    slug,
    description:
      description || null,
    phone:
      phone || null,
    whatsapp:
      whatsapp || null,
    address:
      address || null,

    /*
     * لا نقبل status من النموذج.
     * السيرفر يفرض pending.
     */
    status: "pending",
  };

  const {
    data: business,
    error,
  } = await supabase
    .from("businesses")
    .insert(payload)
    .select("id")
    .single();

  if (error) {
    console.error(
      "Create business error:",
      error,
    );

    redirect(
      `/add-business?error=${encodeURIComponent(
        error.message,
      )}`,
    );
  }

  redirect(
    `/add-business?submitted=${business.id}`,
  );
}
