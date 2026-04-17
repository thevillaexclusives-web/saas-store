"use client";

import Image from "next/image";
import Link from "next/link";
import { Star, Users, BedDouble, Heart } from "lucide-react";
import { storefrontPropertyPath } from "@/lib/storefront/resolver";
import { cn } from "@/lib/utils";
import type { StorefrontProperty } from "@/lib/storefront/types";

interface PropertyCardProps {
  property: StorefrontProperty;
  index: number;
  orgSlug: string;
  storeSlug: string;
}

export function PropertyCard({ property, index, orgSlug, storeSlug }: PropertyCardProps) {
  const staggerClass = `stagger-${Math.min(index + 1, 9)}`;
  const roundedRating = property.rating != null ? Math.round(property.rating) : 0;

  return (
    <Link
      href={storefrontPropertyPath({ orgSlug, storeSlug, propertyId: property.id })}
      className={cn(
        "property-card group relative block overflow-hidden border border-border-subtle/60 bg-surface transition-all duration-300 hover:border-stone-200 hover:shadow-lg hover:shadow-stone-200/50 card-enter [border-radius:var(--storefront-radius-card)]",
        staggerClass
      )}
    >
      {/* Image container */}
      <div className="relative aspect-[4/3] overflow-hidden bg-stone-100">
        <Image
          src={property.image}
          alt={property.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="property-image object-cover"
        />

        {/* Gradient overlay for readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />

        {/* Type badge */}
        <div className="absolute top-3.5 left-3.5">
          <span className="inline-flex bg-white/90 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-stone-700 shadow-sm backdrop-blur-md [border-radius:var(--storefront-radius-button)]">
            {property.type}
          </span>
        </div>

        {/* Wishlist button */}
        <button className="absolute right-3.5 top-3.5 flex h-9 w-9 items-center justify-center bg-white/90 text-stone-400 opacity-0 shadow-sm backdrop-blur-md transition-all hover:bg-white hover:text-rose-500 group-hover:opacity-100 [border-radius:var(--storefront-radius-button)]">
          <Heart className="w-4 h-4" />
        </button>

        {/* Featured badge */}
        {property.isFeatured && (
          <div className="absolute bottom-3.5 left-3.5">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-[var(--storefront-primary-foreground)] shadow-md [background:var(--storefront-primary-fill)] [border-radius:var(--storefront-radius-button)]">
              <svg
                viewBox="0 0 12 12"
                fill="currentColor"
                className="w-2.5 h-2.5"
              >
                <path d="M6 0l1.76 3.77L12 4.38 8.91 7.23 9.71 12 6 9.97 2.29 12l.8-4.77L0 4.38l4.24-.61z" />
              </svg>
              Featured
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 sm:p-5">
        {/* Name */}
        <h3 className="font-semibold text-stone-900 text-[15px] leading-snug line-clamp-2 mb-2 transition-colors group-hover:text-[var(--storefront-primary)]">
          {property.name}
        </h3>

        {/* Specs row */}
        <div className="flex items-center gap-3 text-sm text-stone-500 mb-4">
          <span className="flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-stone-400" />
            {property.guests} guests
          </span>
          <span className="w-px h-3 bg-stone-200" />
          <span className="flex items-center gap-1.5">
            <BedDouble className="w-3.5 h-3.5 text-stone-400" />
            {property.bedrooms}{" "}
            {property.bedrooms === 1 ? "bedroom" : "bedrooms"}
          </span>
        </div>

        {/* Price & Rating */}
        <div className="flex items-end justify-between pt-3 border-t border-stone-100">
          <div>
            {property.price != null ? (
              <>
                <span className="text-xs text-stone-400 font-medium">from</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-xl font-bold text-stone-900 tabular-nums tracking-tight">
                    {property.price.toLocaleString()}
                  </span>
                  <span className="text-sm font-medium text-stone-500">
                    {property.currency}
                  </span>
                </div>
              </>
            ) : (
              <>
                <span className="text-xs text-stone-400 font-medium">pricing</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-base font-semibold text-stone-900">
                    On request
                  </span>
                </div>
              </>
            )}
          </div>

          {property.rating != null ? (
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-semibold text-stone-700 tabular-nums">
                {property.rating.toFixed(1)}
              </span>
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      "w-3.5 h-3.5 star-animate",
                      i < roundedRating
                        ? "fill-amber-400 text-amber-400"
                        : "fill-stone-200 text-stone-200"
                    )}
                    style={{ animationDelay: `${0.3 + i * 0.06}s` }}
                  />
                ))}
              </div>
            </div>
          ) : (
            <div className="text-sm font-medium text-stone-400">New listing</div>
          )}
        </div>
      </div>
    </Link>
  );
}
