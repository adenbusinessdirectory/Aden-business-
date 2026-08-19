"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { getAuthRedirectUrl } from "@/lib/supabase/redirect";
import { createClient } from "@/lib/supabase/server";

function redirectWithError(
  message: string,
): never {
  redirect(
    `/register?error=${encodeURIComponent(message)}`,
  );
}

async function resolveAuthRedirectUrl(): Promise<string> {
  const headerStore = await headers();
  return getAuthRedirectUrl(headerStore);
}

export async function signUp(
  formData: FormData,
): Promise<void> {
  const nameValue =
    formData.get("full_name");

  const emailValue =
    formData.get("email");

  const passwordValue =
    formData.get("password");

  const confirmationValue =
    formData.get("password_confirmation");

  const fullName =
    typeof nameValue === "string"
      ? nameValue.trim()
      : "";

  const email =
    typeof emailValue === "string"
      ? emailValue.trim().toLowerCase()
      : "";

  const password =
    typeof passwordValue === "string"
      ? passwordValue
      : "";

  const confirmation =
    typeof confirmationValue === "string"
      ? confirmationValue
      : "";

  if (fullName.length < 2) {
    redirectWithError(
      "يرجى إدخال الاسم بشكل صحيح.",
    );
  }

  if (!email.includes("@")) {
    redirectWithError(
      "يرجى إدخال بريد إلكتروني صحيح.",
    );
  }

  if (password.length < 8) {
    redirectWithError(
      "كلمة المرور يجب أن تكون 8 أحرف على الأقل.",
    );
  }

  if (password !== confirmation) {
    redirectWithError(
      "كلمتا المرور غير متطابقتين.",
    );
  }

  const supabase = await createClient();

  const { data, error } =
    await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: await resolveAuthRedirectUrl(),
        data: {
          full_name: fullName,
        },
      },
    });

  if (error) {
    redirectWithError(
      "تعذر إنشاء الحساب. حاول مرة أخرى.",
    );
  }

  if (data.session) {
    redirect("/");
  }

  redirect(
    `/login?message=${encodeURIComponent(
      "تم إنشاء الحساب. تحقق من بريدك الإلكتروني لتأكيده.",
    )}`,
  );
}export async function resendConfirmation(formData: FormData) {
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();

  if (!email) {
    redirect(
      `/register?error=${encodeURIComponent(
        "أدخل بريدك الإلكتروني أولاً."
      )}`
    );
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.resend({
    type: "signup",
    email,
    options: {
      emailRedirectTo: await resolveAuthRedirectUrl(),
    },
  });

  if (error) {
    redirect(
      `/register?error=${encodeURIComponent(
        "تعذر إعادة إرسال رابط التحقق. حاول مرة أخرى بعد قليل."
      )}`
    );
  }

  redirect(
    `/register?message=${encodeURIComponent(
      "تم إرسال رابط تحقق جديد إلى بريدك الإلكتروني."
    )}`
  );
}
