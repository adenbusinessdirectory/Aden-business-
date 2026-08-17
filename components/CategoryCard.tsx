import Link from "next/link";
import { ArrowUpLeft, type LucideIcon } from "lucide-react";

type CategoryCardProps = {
  name: string;
  slug: string;
  icon: LucideIcon;
};

export default function CategoryCard({
  name,
  slug,
  icon: Icon,
}: CategoryCardProps) {
  return (
    <Link
      href={`/category/${encodeURIComponent(slug)}`}
      className="focus-ring group surface-card flex min-h-32 flex-col justify-between p-4 transition hover:-translate-y-1 hover:border-brand-100"
    >
      <div className="flex items-start justify-between">
        <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-50 text-brand-700 transition group-hover:bg-brand-700 group-hover:text-white">
          <Icon className="h-5 w-5" />
        </span>

        <ArrowUpLeft className="h-4 w-4 text-slate-300" />
      </div>

      <h3 className="mt-5 font-extrabold text-slate-900">
        {name}
      </h3>
    </Link>
  );
}
