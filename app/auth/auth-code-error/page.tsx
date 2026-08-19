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
