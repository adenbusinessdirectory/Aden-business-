import type { User } from "@supabase/supabase-js";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

export type AppRole =
  | "customer"
  | "merchant"
  | "admin";

export type CurrentProfile = {
  id: string;
  full_name: string | null;
  phone: string | null;
  avatar_url: string | null;
  role: AppRole;
  created_at: string;
  updated_at: string;
};

export type AuthContext = {
  user: User;
  profile: CurrentProfile | null;
  role: AppRole;
};

function normalizeRole(
  value: unknown,
): AppRole {
  if (value === "merchant") {
    return "merchant";
  }

  if (value === "admin") {
    return "admin";
  }

  return "customer";
}

export async function getAuthContext(): Promise<
  AuthContext | null
> {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return null;
  }

  const {
    data: profile,
    error: profileError,
  } = await supabase
    .from("profiles")
    .select(
      `
        id,
        full_name,
        phone,
        avatar_url,
        role,
        created_at,
        updated_at
      `,
    )
    .eq("id", user.id)
    .maybeSingle();

  if (profileError) {
    console.error(
      "Unable to read current profile:",
      profileError.message,
    );
  }

  const normalizedProfile = profile
    ? {
        id: profile.id,
        full_name: profile.full_name,
        phone: profile.phone,
        avatar_url: profile.avatar_url,
        role: normalizeRole(profile.role),
        created_at: profile.created_at,
        updated_at: profile.updated_at,
      }
    : null;

  return {
    user,
    profile: normalizedProfile,
    role: normalizedProfile?.role ?? "customer",
  };
}

export async function requireUser(): Promise<AuthContext> {
  const context = await getAuthContext();

  if (!context) {
    redirect("/login");
  }

  return context;
}

export async function requireMerchant(): Promise<AuthContext> {
  const context = await requireUser();

  if (
    context.role !== "merchant" &&
    context.role !== "admin"
  ) {
    redirect("/account?error=merchant_required");
  }

  return context;
}

export async function requireAdmin(): Promise<AuthContext> {
  const context = await requireUser();

  if (context.role !== "admin") {
    redirect("/account?error=admin_required");
  }

  return context;
}

export function roleLabel(
  role: AppRole,
): string {
  switch (role) {
    case "admin":
      return "مدير النظام";

    case "merchant":
      return "تاجر";

    default:
      return "عميل";
  }
}

export function roleHome(
  role: AppRole,
): string {
  switch (role) {
    case "admin":
      return "/admin";

    case "merchant":
      return "/dashboard";

    default:
      return "/account";
  }
}
