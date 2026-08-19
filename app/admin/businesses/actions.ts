"use server";

import {
  revalidatePath,
} from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

async function requireAdminAction() {
  const supabase =
    await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const {
    data: profile,
    error,
  } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (
    error ||
    profile?.role !== "admin"
  ) {
    redirect(
      "/account?error=admin_required",
    );
  }

  return supabase;
}

function value(
  formData: FormData,
  key: string,
): string {
  const item =
    formData.get(key);

  return typeof item === "string"
    ? item.trim()
    : "";
}

export async function approveBusiness(
  formData: FormData,
) {
  const supabase =
    await requireAdminAction();

  const businessId =
    value(
      formData,
      "business_id",
    );

  const ownerId =
    value(
      formData,
      "owner_id",
    );

  if (
    !businessId ||
    !ownerId
  ) {
    redirect(
      "/admin/businesses?error=missing_data",
    );
  }

  /*
   * أولًا نعتمد النشاط.
   */
  const {
    error: businessError,
  } = await supabase
    .from("businesses")
    .update({
      status: "approved",
      rejection_reason: null,
    })
    .eq("id", businessId)
    .eq("owner_id", ownerId);

  if (businessError) {
    console.error(
      "Approve business error:",
      businessError,
    );

    redirect(
      `/admin/businesses?error=${encodeURIComponent(
        businessError.message,
      )}`,
    );
  }

  /*
   * ثم نرفع صاحب النشاط إلى merchant.
   * Trigger قاعدة البيانات يسمح بذلك
   * للـAdmin فقط.
   *
   * لا نخفض admin إلى merchant.
   */
  const {
    data: ownerProfile,
    error: ownerReadError,
  } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", ownerId)
    .single();

  if (ownerReadError) {
    console.error(
      "Owner profile read error:",
      ownerReadError,
    );

    redirect(
      `/admin/businesses?error=${encodeURIComponent(
        ownerReadError.message,
      )}`,
    );
  }

  if (
    ownerProfile.role !== "admin"
  ) {
    const {
      error: roleError,
    } = await supabase
      .from("profiles")
      .update({
        role: "merchant",
      })
      .eq("id", ownerId);

    if (roleError) {
      console.error(
        "Merchant role update error:",
        roleError,
      );

      redirect(
        `/admin/businesses?error=${encodeURIComponent(
          roleError.message,
        )}`,
      );
    }
  }

  revalidatePath(
    "/admin",
  );

  revalidatePath(
    "/admin/businesses",
  );

  redirect(
    "/admin/businesses?success=approved",
  );
}

export async function rejectBusiness(
  formData: FormData,
) {
  const supabase =
    await requireAdminAction();

  const businessId =
    value(
      formData,
      "business_id",
    );

  const rejectionReason =
    value(
      formData,
      "rejection_reason",
    );

  if (!businessId) {
    redirect(
      "/admin/businesses?error=missing_business",
    );
  }

  const {
    error,
  } = await supabase
    .from("businesses")
    .update({
      status: "rejected",
      rejection_reason:
        rejectionReason ||
        "لم يتم اعتماد النشاط.",
    })
    .eq("id", businessId);

  if (error) {
    console.error(
      "Reject business error:",
      error,
    );

    redirect(
      `/admin/businesses?error=${encodeURIComponent(
        error.message,
      )}`,
    );
  }

  revalidatePath(
    "/admin",
  );

  revalidatePath(
    "/admin/businesses",
  );

  redirect(
    "/admin/businesses?success=rejected",
  );
}
