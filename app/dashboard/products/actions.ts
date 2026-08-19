"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

function value(formData: FormData, key: string) {
  const item = formData.get(key);
  return typeof item === "string" ? item.trim() : "";
}

async function ownedBusiness(supabase: Awaited<ReturnType<typeof createClient>>, businessId: string, userId: string) {
  const { data } = await supabase
    .from("businesses")
    .select("id")
    .eq("id", businessId)
    .eq("owner_id", userId)
    .eq("status", "approved")
    .maybeSingle();

  return data;
}

async function merchantClient() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  return { supabase, user };
}

export async function createProduct(formData: FormData) {
  const { supabase, user } = await merchantClient();
  const businessId = value(formData, "business_id");
  const name = value(formData, "name_ar");
  const price = value(formData, "price");

  if (!businessId || !name) redirect("/dashboard/products?error=required");
  if (price && Number.isNaN(Number(price))) redirect("/dashboard/products?error=price");
  if (!(await ownedBusiness(supabase, businessId, user.id))) redirect("/dashboard/products?error=business");

  const { error } = await supabase.from("products").insert({
    business_id: businessId,
    name_ar: name,
    description: value(formData, "description") || null,
    price: price ? Number(price) : null,
  });

  if (error) redirect(`/dashboard/products?error=${encodeURIComponent(error.message)}`);
  revalidatePath("/dashboard/products");
  redirect("/dashboard/products?success=created");
}

export async function updateProduct(formData: FormData) {
  const { supabase, user } = await merchantClient();
  const productId = value(formData, "product_id");
  const businessId = value(formData, "business_id");
  const name = value(formData, "name_ar");
  const price = value(formData, "price");

  if (!productId || !businessId || !name) redirect("/dashboard/products?error=required");
  if (price && Number.isNaN(Number(price))) redirect("/dashboard/products?error=price");
  if (!(await ownedBusiness(supabase, businessId, user.id))) redirect("/dashboard/products?error=business");

  const { error } = await supabase.from("products").update({
    name_ar: name,
    description: value(formData, "description") || null,
    price: price ? Number(price) : null,
  }).eq("id", productId).eq("business_id", businessId);

  if (error) redirect(`/dashboard/products?error=${encodeURIComponent(error.message)}`);
  revalidatePath("/dashboard/products");
  redirect("/dashboard/products?success=updated");
}

export async function deleteProduct(formData: FormData) {
  const { supabase, user } = await merchantClient();
  const productId = value(formData, "product_id");
  const businessId = value(formData, "business_id");
  if (!productId || !(await ownedBusiness(supabase, businessId, user.id))) redirect("/dashboard/products?error=business");

  const { error } = await supabase.from("products").delete().eq("id", productId).eq("business_id", businessId);
  if (error) redirect(`/dashboard/products?error=${encodeURIComponent(error.message)}`);
  revalidatePath("/dashboard/products");
  redirect("/dashboard/products?success=deleted");
}