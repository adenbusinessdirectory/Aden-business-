"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

function textValue(formData: FormData, key: string) {
  const value = formData.get(key);

  return typeof value === "string" ? value.trim() : "";
}

export async function updateBusiness(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const businessId = textValue(formData, "business_id");
  const nameAr = textValue(formData, "name_ar");
  const cityId = textValue(formData, "city_id");

  if (!businessId) {
    redirect("/dashboard?error=missing_business");
  }

  if (!nameAr) {
    redirect(`/dashboard/edit/${businessId}?error=name_required`);
  }

  if (!cityId) {
    redirect(`/dashboard/edit/${businessId}?error=city_required`);
  }

  const { error } = await supabase
    .from("businesses")
    .update({
      name_ar: nameAr,
      description: textValue(formData, "description") || null,
      city_id: cityId,
      area_id: textValue(formData, "area_id") || null,
      category_id: textValue(formData, "category_id") || null,
      phone: textValue(formData, "phone") || null,
      whatsapp: textValue(formData, "whatsapp") || null,
      address: textValue(formData, "address") || null,
      status: "pending",
      rejection_reason: null,
    })
    .eq("id", businessId)
    .eq("owner_id", user.id)
    .in("status", ["pending", "rejected"]);

  if (error) {
    console.error("Update business error:", error);
    redirect(`/dashboard/edit/${businessId}?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/dashboard");
  revalidatePath(`/dashboard/edit/${businessId}`);
  redirect("/dashboard?success=updated");
}