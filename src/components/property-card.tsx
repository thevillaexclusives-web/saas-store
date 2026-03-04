"use client";

import Image from "next/image";
import Link from "next/link";
import { Star, Users, BedDouble, Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Property } from "@/lib/mock-data";

interface PropertyCardProps {
  property: Property;
  index: number;
}

export function PropertyCard({ property, index }: PropertyCardProps) {
  const staggerClass = `stagger-${Math.min(index + 1, 9)}`;

  return (
    <Link
      href={`/property/${property.id}`}
      className={cn(
        "property-card group relative block bg-surface rounded-2xl overflow-hidden border border-border-subtle/60 hover:border-stone-200 hover:shadow-lg hover:shadow-stone-200/50 transition-all duration-300 card-enter",
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
          <span className="inline-flex px-3 py-1 bg-white/90 backdrop-blur-md rounded-full text-xs font-semibold text-stone-700 uppercase tracking-wider shadow-sm">
            {property.type}
          </span>
        </div>

        {/* Wishlist button */}
        <button className="absolute top-3.5 right-3.5 w-9 h-9 flex items-center justify-center rounded-full bg-white/90 backdrop-blur-md text-stone-400 hover:text-rose-500 hover:bg-white transition-all shadow-sm opacity-0 group-hover:opacity-100">
          <Heart className="w-4 h-4" />
        </button>

        {/* Featured badge */}
        {property.isFeatured && (
          <div className="absolute bottom-3.5 left-3.5">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-sand-500 rounded-full text-[11px] font-bold text-white uppercase tracking-wider shadow-md">
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
        <h3 className="font-semibold text-stone-900 text-[15px] leading-snug line-clamp-2 mb-2 group-hover:text-sand-700 transition-colors">
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
            <span className="text-xs text-stone-400 font-medium">from</span>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-bold text-stone-900 tabular-nums tracking-tight">
                {property.price.toLocaleString()}
              </span>
              <span className="text-sm font-medium text-stone-500">
                {property.currency}
              </span>
            </div>
          </div>

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
                    i < Math.round(property.rating)
                      ? "fill-amber-400 text-amber-400"
                      : "fill-stone-200 text-stone-200"
                  )}
                  style={{ animationDelay: `${0.3 + i * 0.06}s` }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
