"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

function value(formData: FormData, key: string) {
  const item = formData.get(key);
  return typeof item === "string" ? item.trim() : "";
}

async function merchantClient() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  return { supabase, user };
}

async function ownsApprovedBusiness(supabase: Awaited<ReturnType<typeof createClient>>, businessId: string, userId: string) {
  const { data } = await supabase.from("businesses").select("id").eq("id", businessId).eq("owner_id", userId).eq("status", "approved").maybeSingle();
  return data;
}

function validateDiscount(discount: string) {
  return !discount || (!Number.isNaN(Number(discount)) && Number(discount) >= 0 && Number(discount) <= 100);
}

export async function createOffer(formData: FormData) {
  const { supabase, user } = await merchantClient();
  const businessId = value(formData, "business_id");
  const title = value(formData, "title_ar");
  const discount = value(formData, "discount_percentage");
  if (!businessId || !title) redirect("/dashboard/offers?error=required");
  if (!validateDiscount(discount)) redirect("/dashboard/offers?error=discount");
  if (!(await ownsApprovedBusiness(supabase, businessId, user.id))) redirect("/dashboard/offers?error=business");

  const { error } = await supabase.from("offers").insert({
    business_id: businessId,
    title_ar: title,
    description: value(formData, "description") || null,
    discount_percentage: discount ? Number(discount) : null,
    starts_at: value(formData, "starts_at") || null,
  });
  if (error) redirect(`/dashboard/offers?error=${encodeURIComponent(error.message)}`);
  revalidatePath("/dashboard/offers");
  redirect("/dashboard/offers?success=created");
}

export async function updateOffer(formData: FormData) {
  const { supabase, user } = await merchantClient();
  const offerId = value(formData, "offer_id");
  const businessId = value(formData, "business_id");
  const title = value(formData, "title_ar");
  const discount = value(formData, "discount_percentage");
  if (!offerId || !businessId || !title) redirect("/dashboard/offers?error=required");
  if (!validateDiscount(discount)) redirect("/dashboard/offers?error=discount");
  if (!(await ownsApprovedBusiness(supabase, businessId, user.id))) redirect("/dashboard/offers?error=business");

  const { error } = await supabase.from("offers").update({
    title_ar: title,
    description: value(formData, "description") || null,
    discount_percentage: discount ? Number(discount) : null,
    starts_at: value(formData, "starts_at") || null,
  }).eq("id", offerId).eq("business_id", businessId);
  if (error) redirect(`/dashboard/offers?error=${encodeURIComponent(error.message)}`);
  revalidatePath("/dashboard/offers");
  redirect("/dashboard/offers?success=updated");
}

export async function deleteOffer(formData: FormData) {
  const { supabase, user } = await merchantClient();
  const offerId = value(formData, "offer_id");
  const businessId = value(formData, "business_id");
  if (!offerId || !(await ownsApprovedBusiness(supabase, businessId, user.id))) redirect("/dashboard/offers?error=business");
  const { error } = await supabase.from("offers").delete().eq("id", offerId).eq("business_id", businessId);
  if (error) redirect(`/dashboard/offers?error=${encodeURIComponent(error.message)}`);
  revalidatePath("/dashboard/offers");
  redirect("/dashboard/offers?success=deleted");
}