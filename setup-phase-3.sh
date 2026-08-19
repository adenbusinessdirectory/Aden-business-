#!/usr/bin/env bash
set -e

echo "=========================================="
echo " دليل عدن التجاري - المرحلة الثالثة"
echo " Supabase Auth + SSR"
echo "=========================================="

mkdir -p app/login
mkdir -p app/register
mkdir -p app/auth/confirm
mkdir -p app/auth/signout
mkdir -p app/auth/auth-code-error
mkdir -p lib/supabase

# =========================================================
# lib/supabase/proxy.ts
# =========================================================

cat > lib/supabase/proxy.ts <<'EOF'
import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

import { getSupabasePublicEnvironment } from "@/lib/supabase/env";

export async function updateSession(
  request: NextRequest,
): Promise<NextResponse> {
  let response = NextResponse.next({
    request,
  });

  const { url, publishableKey } =
    getSupabasePublicEnvironment();

  const supabase = createServerClient(
    url,
    publishableKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },

        setAll(cookiesToSet) {
          cookiesToSet.forEach(
            ({ name, value }) => {
              request.cookies.set(name, value);
            },
          );

          response = NextResponse.next({
            request,
          });

          cookiesToSet.forEach(
            ({ name, value, options }) => {
              response.cookies.set(
                name,
                value,
                options,
              );
            },
          );
        },
      },
    },
  );

  await supabase.auth.getClaims();

  return response;
}
EOF

# =========================================================
# proxy.ts
# =========================================================

cat > proxy.ts <<'EOF'
import type { NextRequest } from "next/server";

import { updateSession } from "@/lib/supabase/proxy";

export async function proxy(
  request: NextRequest,
) {
  return updateSession(request);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|avif)$).*)",
  ],
};
EOF

# =========================================================
# app/login/actions.ts
# =========================================================

cat > app/login/actions.ts <<'EOF'
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
EOF

# =========================================================
# app/login/page.tsx
# =========================================================

cat > app/login/page.tsx <<'EOF'
import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowLeft,
  LockKeyhole,
  Mail,
  ShieldCheck,
} from "lucide-react";

import { signIn } from "@/app/login/actions";

export const metadata: Metadata = {
  title: "تسجيل الدخول",
};

type LoginPageProps = {
  searchParams: Promise<{
    error?: string;
    message?: string;
  }>;
};

export default async function LoginPage({
  searchParams,
}: LoginPageProps) {
  const params = await searchParams;

  return (
    <section className="min-h-[calc(100vh-72px)] bg-surface py-12">
      <div className="container-shell">
        <div className="surface-card mx-auto max-w-md overflow-hidden">
          <div className="bg-brand-900 px-6 py-8 text-white">
            <h1 className="text-2xl font-black">
              تسجيل الدخول
            </h1>

            <p className="mt-2 text-sm leading-7 text-white/70">
              ادخل إلى حسابك في دليل عدن التجاري.
            </p>
          </div>

          <div className="p-6 sm:p-8">
            {params.error ? (
              <div className="mb-5 rounded-xl bg-red-50 p-4 text-sm text-red-700">
                {params.error}
              </div>
            ) : null}

            {params.message ? (
              <div className="mb-5 rounded-xl bg-brand-50 p-4 text-sm text-brand-800">
                {params.message}
              </div>
            ) : null}

            <form
              action={signIn}
              className="space-y-5"
            >
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-extrabold"
                >
                  البريد الإلكتروني
                </label>

                <div className="relative">
                  <Mail className="absolute top-1/2 right-4 h-5 w-5 -translate-y-1/2 text-slate-400" />

                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    dir="ltr"
                    className="h-13 w-full rounded-xl border border-border-soft pr-12 pl-4 text-left outline-none focus:border-brand-500"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-extrabold"
                >
                  كلمة المرور
                </label>

                <div className="relative">
                  <LockKeyhole className="absolute top-1/2 right-4 h-5 w-5 -translate-y-1/2 text-slate-400" />

                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    minLength={8}
                    autoComplete="current-password"
                    className="h-13 w-full rounded-xl border border-border-soft pr-12 pl-4 outline-none focus:border-brand-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="flex h-13 w-full items-center justify-center gap-2 rounded-xl bg-brand-800 font-extrabold text-white hover:bg-brand-900"
              >
                تسجيل الدخول
                <ArrowLeft className="h-4 w-4" />
              </button>
            </form>

            <div className="mt-6 flex gap-2 rounded-xl bg-slate-50 p-4 text-xs leading-6 text-slate-500">
              <ShieldCheck className="h-4 w-4 shrink-0 text-brand-600" />
              <span>
                تتم المصادقة باستخدام Supabase Auth.
              </span>
            </div>

            <p className="mt-6 text-center text-sm text-slate-500">
              ليس لديك حساب؟{" "}
              <Link
                href="/register"
                className="font-extrabold text-brand-700"
              >
                إنشاء حساب
              </Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
EOF

# =========================================================
# app/register/actions.ts
# =========================================================

cat > app/register/actions.ts <<'EOF'
"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

function redirectWithError(
  message: string,
): never {
  redirect(
    `/register?error=${encodeURIComponent(message)}`,
  );
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

  const headerStore = await headers();

  const origin =
    headerStore.get("origin") ??
    process.env.NEXT_PUBLIC_SITE_URL ??
    "http://localhost:3000";

  const supabase = await createClient();

  const { data, error } =
    await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo:
          `${origin}/auth/confirm`,
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
}
EOF

# =========================================================
# app/register/page.tsx
# =========================================================

cat > app/register/page.tsx <<'EOF'
import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowLeft,
  LockKeyhole,
  Mail,
  UserRound,
} from "lucide-react";

import { signUp } from "@/app/register/actions";

export const metadata: Metadata = {
  title: "إنشاء حساب",
};

type RegisterPageProps = {
  searchParams: Promise<{
    error?: string;
  }>;
};

export default async function RegisterPage({
  searchParams,
}: RegisterPageProps) {
  const params = await searchParams;

  return (
    <section className="min-h-[calc(100vh-72px)] bg-surface py-12">
      <div className="container-shell">
        <div className="surface-card mx-auto max-w-lg overflow-hidden">
          <div className="bg-brand-900 px-6 py-8 text-white">
            <h1 className="text-2xl font-black">
              إنشاء حساب جديد
            </h1>

            <p className="mt-2 text-sm leading-7 text-white/70">
              أنشئ حسابك في دليل عدن التجاري.
            </p>
          </div>

          <div className="p-6 sm:p-8">
            {params.error ? (
              <div className="mb-5 rounded-xl bg-red-50 p-4 text-sm text-red-700">
                {params.error}
              </div>
            ) : null}

            <form
              action={signUp}
              className="space-y-5"
            >
              <div>
                <label
                  htmlFor="full_name"
                  className="mb-2 block text-sm font-extrabold"
                >
                  الاسم الكامل
                </label>

                <div className="relative">
                  <UserRound className="absolute top-1/2 right-4 h-5 w-5 -translate-y-1/2 text-slate-400" />

                  <input
                    id="full_name"
                    name="full_name"
                    type="text"
                    required
                    minLength={2}
                    maxLength={100}
                    autoComplete="name"
                    className="h-13 w-full rounded-xl border border-border-soft pr-12 pl-4 outline-none focus:border-brand-500"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-extrabold"
                >
                  البريد الإلكتروني
                </label>

                <div className="relative">
                  <Mail className="absolute top-1/2 right-4 h-5 w-5 -translate-y-1/2 text-slate-400" />

                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    dir="ltr"
                    className="h-13 w-full rounded-xl border border-border-soft pr-12 pl-4 text-left outline-none focus:border-brand-500"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-extrabold"
                >
                  كلمة المرور
                </label>

                <div className="relative">
                  <LockKeyhole className="absolute top-1/2 right-4 h-5 w-5 -translate-y-1/2 text-slate-400" />

                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    minLength={8}
                    autoComplete="new-password"
                    className="h-13 w-full rounded-xl border border-border-soft pr-12 pl-4 outline-none focus:border-brand-500"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="password_confirmation"
                  className="mb-2 block text-sm font-extrabold"
                >
                  تأكيد كلمة المرور
                </label>

                <div className="relative">
                  <LockKeyhole className="absolute top-1/2 right-4 h-5 w-5 -translate-y-1/2 text-slate-400" />

                  <input
                    id="password_confirmation"
                    name="password_confirmation"
                    type="password"
                    required
                    minLength={8}
                    autoComplete="new-password"
                    className="h-13 w-full rounded-xl border border-border-soft pr-12 pl-4 outline-none focus:border-brand-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="flex h-13 w-full items-center justify-center gap-2 rounded-xl bg-brand-800 font-extrabold text-white hover:bg-brand-900"
              >
                إنشاء الحساب
                <ArrowLeft className="h-4 w-4" />
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-slate-500">
              لديك حساب؟{" "}
              <Link
                href="/login"
                className="font-extrabold text-brand-700"
              >
                تسجيل الدخول
              </Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
EOF

# =========================================================
# app/auth/confirm/route.ts
# =========================================================

cat > app/auth/confirm/route.ts <<'EOF'
import {
  type EmailOtpType,
} from "@supabase/supabase-js";

import {
  type NextRequest,
  NextResponse,
} from "next/server";

import { createClient } from "@/lib/supabase/server";

export async function GET(
  request: NextRequest,
) {
  const url = new URL(request.url);

  const tokenHash =
    url.searchParams.get("token_hash");

  const type =
    url.searchParams.get("type");

  const code =
    url.searchParams.get("code");

  const supabase = await createClient();

  if (tokenHash && type) {
    const { error } =
      await supabase.auth.verifyOtp({
        type: type as EmailOtpType,
        token_hash: tokenHash,
      });

    if (!error) {
      return NextResponse.redirect(
        new URL("/", request.url),
      );
    }
  }

  if (code) {
    const { error } =
      await supabase.auth.exchangeCodeForSession(
        code,
      );

    if (!error) {
      return NextResponse.redirect(
        new URL("/", request.url),
      );
    }
  }

  return NextResponse.redirect(
    new URL(
      "/auth/auth-code-error",
      request.url,
    ),
  );
}
EOF

# =========================================================
# app/auth/signout/route.ts
# =========================================================

cat > app/auth/signout/route.ts <<'EOF'
import {
  type NextRequest,
  NextResponse,
} from "next/server";

import { createClient } from "@/lib/supabase/server";

export async function POST(
  request: NextRequest,
) {
  const supabase = await createClient();

  await supabase.auth.signOut();

  return NextResponse.redirect(
    new URL("/", request.url),
    {
      status: 303,
    },
  );
}
EOF

# =========================================================
# app/auth/auth-code-error/page.tsx
# =========================================================

cat > app/auth/auth-code-error/page.tsx <<'EOF'
import Link from "next/link";
import {
  CircleAlert,
  Home,
} from "lucide-react";

export default function AuthCodeErrorPage() {
  return (
    <section className="min-h-[calc(100vh-72px)] bg-surface py-16">
      <div className="container-shell">
        <div className="surface-card mx-auto max-w-lg p-8 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-600">
            <CircleAlert className="h-7 w-7" />
          </div>

          <h1 className="mt-6 text-2xl font-black">
            تعذر تأكيد الحساب
          </h1>

          <p className="mt-3 leading-8 text-slate-500">
            قد يكون رابط التأكيد منتهي الصلاحية
            أو تم استخدامه سابقًا.
          </p>

          <Link
            href="/"
            className="mt-7 inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-brand-800 px-6 font-extrabold text-white"
          >
            <Home className="h-4 w-4" />
            العودة للرئيسية
          </Link>
        </div>
      </div>
    </section>
  );
}
EOF

echo ""
echo "=========================================="
echo " فحص TypeScript"
echo "=========================================="

npm run typecheck

echo ""
echo "=========================================="
echo " Production Build"
echo "=========================================="

npm run build

echo ""
echo "=========================================="
echo " المرحلة الثالثة نجحت"
echo "=========================================="
echo ""
echo "تم إنشاء:"
echo "- /login"
echo "- /register"
echo "- /auth/confirm"
echo "- /auth/signout"
echo "- proxy.ts"
echo "- lib/supabase/proxy.ts"
echo ""
echo "الخطوة التالية:"
echo "npm run dev"
echo ""