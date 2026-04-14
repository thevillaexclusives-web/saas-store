"use client";

import { LayoutGrid, List, SlidersHorizontal, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

interface ListingHeaderProps {
  title: string;
  locationLabel: string;
  resultCount: number;
  viewMode: "grid" | "list";
  onViewModeChange: (mode: "grid" | "list") => void;
}

export function ListingHeader({
  title,
  locationLabel,
  resultCount,
  viewMode,
  onViewModeChange,
}: ListingHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <MapPin className="w-4 h-4 text-[var(--storefront-primary)]" />
          <span className="text-sm text-stone-500 font-medium">
            {locationLabel}
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-stone-900 tracking-tight leading-tight">
          {title}
        </h1>
        <p className="mt-2 text-stone-500 text-[15px]">
          <span className="font-semibold text-stone-700 tabular-nums">
            {resultCount}
          </span>{" "}
          {resultCount === 1 ? "property" : "properties"} available
        </p>
      </div>

      <div className="flex items-center gap-2">
        {/* View toggle */}
        <div className="flex items-center bg-stone-100 rounded-lg p-1">
          <button
            onClick={() => onViewModeChange("grid")}
            className={cn(
              "p-2 rounded-md transition-all",
              viewMode === "grid"
                ? "bg-white text-stone-800 shadow-sm"
                : "text-stone-400 hover:text-stone-600"
            )}
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button
            onClick={() => onViewModeChange("list")}
            className={cn(
              "p-2 rounded-md transition-all",
              viewMode === "list"
                ? "bg-white text-stone-800 shadow-sm"
                : "text-stone-400 hover:text-stone-600"
            )}
          >
            <List className="w-4 h-4" />
          </button>
        </div>

        {/* Filters button */}
        <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-border-subtle rounded-lg text-sm font-medium text-stone-700 hover:border-stone-300 hover:shadow-sm transition-all">
          <SlidersHorizontal className="w-4 h-4" />
          Filters
        </button>
      </div>
    </div>
  );
}
