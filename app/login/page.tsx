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
