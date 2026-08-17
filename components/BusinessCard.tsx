import Link from "next/link";
import {
  BadgeCheck,
  Building2,
  MapPin,
  Sparkles,
  Star,
} from "lucide-react";

export type BusinessCardData = {
  id: string;
  name: string;
  slug: string;
  category: string;
  area: string;
  rating: number;
  reviewsCount: number;
  verified: boolean;
  featured: boolean;
  description?: string | null;
};

type BusinessCardProps = {
  business: BusinessCardData;
};

export default function BusinessCard({
  business,
}: BusinessCardProps) {
  return (
    <article className="surface-card group overflow-hidden transition hover:-translate-y-1">
      <Link
        href={`/business/${encodeURIComponent(business.slug)}`}
        className="focus-ring block"
      >
        <div className="relative flex aspect-[16/8.5] items-center justify-center overflow-hidden bg-gradient-to-br from-brand-950 via-brand-800 to-brand-600">
          <Building2 className="h-16 w-16 text-white/25" />

          {business.featured ? (
            <span className="absolute top-3 right-3 inline-flex items-center gap-1 rounded-full bg-gold-100 px-3 py-1.5 text-xs font-extrabold text-gold-700">
              <Sparkles className="h-3.5 w-3.5" />
              مميز
            </span>
          ) : null}

          <div className="absolute right-4 -bottom-7 flex h-16 w-16 items-center justify-center rounded-2xl border-4 border-white bg-white text-brand-800 shadow-md">
            <Building2 className="h-7 w-7" />
          </div>
        </div>

        <div className="px-5 pt-10 pb-5">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <h3 className="truncate text-lg font-black text-slate-900">
                  {business.name}
                </h3>

                {business.verified ? (
                  <BadgeCheck className="h-5 w-5 shrink-0 fill-brand-600 text-white" />
                ) : null}
              </div>

              <p className="mt-1 text-sm font-semibold text-brand-700">
                {business.category}
              </p>
            </div>

            <div className="flex shrink-0 items-center gap-1 rounded-lg bg-gold-50 px-2 py-1">
              <Star className="h-4 w-4 fill-gold-500 text-gold-500" />
              <span className="text-sm font-extrabold">
                {business.rating.toFixed(1)}
              </span>
            </div>
          </div>

          {business.description ? (
            <p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-500">
              {business.description}
            </p>
          ) : null}

          <div className="mt-4 flex items-center justify-between border-t border-border-soft pt-4">
            <span className="inline-flex items-center gap-1.5 text-sm text-slate-500">
              <MapPin className="h-4 w-4 text-brand-600" />
              {business.area}
            </span>

            <span className="text-xs text-slate-400">
              {business.reviewsCount.toLocaleString("ar-YE")} تقييم
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}
