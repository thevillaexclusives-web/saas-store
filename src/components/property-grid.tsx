"use client";

import { PropertyCard } from "./property-card";
import type { StorefrontProperty } from "@/lib/storefront/types";

interface PropertyGridProps {
  properties: StorefrontProperty[];
  orgSlug: string;
  storeSlug: string;
  emptyTitle?: string;
  emptyDescription?: string;
}

export function PropertyGrid({
  properties,
  orgSlug,
  storeSlug,
  emptyTitle = "No properties found",
  emptyDescription = "Try adjusting your filters or browse all categories to discover available listings.",
}: PropertyGridProps) {
  if (properties.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="w-16 h-16 rounded-2xl bg-stone-100 flex items-center justify-center mb-4">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            className="w-8 h-8 text-stone-400"
          >
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <line x1="9" y1="22" x2="9" y2="12" />
            <line x1="15" y1="22" x2="15" y2="12" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-stone-800 mb-1">
          {emptyTitle}
        </h3>
        <p className="text-sm text-stone-500 max-w-sm">
          {emptyDescription}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
      {properties.map((property, i) => (
        <PropertyCard
          key={property.id}
          property={property}
          index={i}
          orgSlug={orgSlug}
          storeSlug={storeSlug}
        />
      ))}
    </div>
  );
}
