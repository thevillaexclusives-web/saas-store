"use client";

import { useState, useMemo } from "react";
import { Navbar } from "@/components/navbar";
import { CategoryBar } from "@/components/category-bar";
import { ListingHeader } from "@/components/listing-header";
import { PropertyGrid } from "@/components/property-grid";
import { properties } from "@/lib/mock-data";

export default function Home() {
  const [activeCategory, setActiveCategory] = useState("All Properties");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const filteredProperties = useMemo(() => {
    if (activeCategory === "All Properties") return properties;
    return properties.filter((p) => p.type === activeCategory);
  }, [activeCategory]);

  return (
    <div className="min-h-screen bg-surface-muted">
      <Navbar />
      <CategoryBar
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
      />

      <main className="mx-auto max-w-[1400px] px-6 lg:px-10 py-8 sm:py-10">
        <ListingHeader
          resultCount={filteredProperties.length}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
        />
        <PropertyGrid properties={filteredProperties} />

        {/* Bottom breathing room */}
        <div className="h-16" />
      </main>

      {/* Minimal footer */}
      <footer className="border-t border-border-subtle bg-surface">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10 py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-stone-500">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-sand-500 to-sand-700 flex items-center justify-center">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  className="w-3.5 h-3.5 text-white"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                </svg>
              </div>
              <span className="font-semibold text-stone-700">
                Villa<span className="text-sand-600">Hub</span>
              </span>
            </div>
            <p>&copy; {new Date().getFullYear()} VillaHub. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
