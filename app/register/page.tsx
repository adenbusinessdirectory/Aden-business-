import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowLeft,
  LockKeyhole,
  Mail,
  UserRound,
} from "lucide-react";

import { signUp, resendConfirmation } from "@/app/register/actions";

export const metadata: Metadata = {
  title: "إنشاء حساب",
};

type RegisterPageProps = {
  searchParams: Promise<{
    error?: string;
    message?: string;
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

            {params.message ? (
              <div className="mb-5 rounded-xl bg-brand-50 p-4 text-sm text-brand-800">
                {params.message}
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

              <button
                type="submit"
                formAction={resendConfirmation}
                className="h-13 w-full rounded-xl border border-brand-200 font-extrabold text-brand-800 hover:bg-brand-50"
              >
                إعادة إرسال رابط التحقق
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
