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
import { categories } from "@/lib/mock-data";

const iconMap: Record<string, React.ElementType> = {
  "layout-grid": LayoutGrid,
  home: Home,
  "building-2": Building2,
  house: House,
  building: Building,
  warehouse: Warehouse,
};

interface CategoryBarProps {
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

export function CategoryBar({
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
                    ? "bg-sand-600 text-white shadow-md shadow-sand-600/20"
                    : "bg-stone-100 text-stone-600 hover:bg-sand-50 hover:text-sand-800"
                )}
              >
                <Icon
                  className={cn(
                    "w-4 h-4",
                    isActive ? "text-white/70" : "text-stone-400"
                  )}
                />
                <span>{cat.name}</span>
                <span
                  className={cn(
                    "text-xs tabular-nums",
                    isActive ? "text-stone-400" : "text-stone-400"
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
