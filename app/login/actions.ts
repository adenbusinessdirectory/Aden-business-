"use server";

import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

function redirectWithError(
  message: string,
): never {
  redirect(
    `/login?error=${encodeURIComponent(message)}`,
  );
}

export async function signIn(
  formData: FormData,
): Promise<void> {
  const emailValue = formData.get("email");
  const passwordValue =
    formData.get("password");

  const email =
    typeof emailValue === "string"
      ? emailValue.trim().toLowerCase()
      : "";

  const password =
    typeof passwordValue === "string"
      ? passwordValue
      : "";

  if (!email || !password) {
    redirectWithError(
      "يرجى إدخال البريد الإلكتروني وكلمة المرور.",
    );
  }

  const supabase = await createClient();

  const { error } =
    await supabase.auth.signInWithPassword({
      email,
      password,
    });

  if (error) {
    redirectWithError(
      "بيانات تسجيل الدخول غير صحيحة.",
    );
  }

  redirect("/");
}
