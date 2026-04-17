"use client";

import {
  LayoutGrid,
  Home,
  Building2,
  House,
  Building,
  Warehouse,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { StorefrontCategory } from "@/lib/storefront/types";

const iconMap: Record<string, React.ElementType> = {
  "layout-grid": LayoutGrid,
  home: Home,
  "building-2": Building2,
  house: House,
  building: Building,
  warehouse: Warehouse,
};

interface CategoryBarProps {
  categories: StorefrontCategory[];
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

export function CategoryBar({
  categories,
  activeCategory,
  onCategoryChange,
}: CategoryBarProps) {
  return (
    <div className="border-b border-border-subtle bg-surface">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <div className="flex items-center gap-2 py-3 overflow-x-auto scrollbar-none">
          {categories.map((cat) => {
            const Icon = iconMap[cat.icon] || LayoutGrid;
            const isActive = activeCategory === cat.name;

            return (
              <button
                key={cat.name}
                onClick={() => onCategoryChange(cat.name)}
                className={cn(
                  "flex items-center gap-2.5 px-5 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-all shrink-0",
                  isActive
                    ? "[background:var(--storefront-primary-fill)] text-[var(--storefront-primary-foreground)] shadow-md"
                    : "bg-[var(--storefront-secondary-surface-strong)] text-stone-600 hover:bg-[var(--storefront-primary-soft)] hover:text-[var(--storefront-primary)]"
                )}
              >
                <Icon
                  className={cn(
                    "w-4 h-4",
                    isActive
                      ? "text-[var(--storefront-primary-foreground)] opacity-70"
                      : "text-stone-400"
                  )}
                />
                <span>{cat.name}</span>
                <span
                  className={cn(
                    "text-xs tabular-nums",
                    isActive
                      ? "text-[var(--storefront-primary-foreground)] opacity-70"
                      : "text-stone-400"
                  )}
                >
                  {cat.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
