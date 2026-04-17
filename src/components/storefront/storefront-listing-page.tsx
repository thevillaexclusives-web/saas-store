"use client";

import { useMemo, useState } from "react";
import { CategoryBar } from "@/components/category-bar";
import { ListingHeader } from "@/components/listing-header";
import { Navbar } from "@/components/navbar";
import { PropertyGrid } from "@/components/property-grid";
import { StorefrontFooter } from "@/components/storefront/footer";
import { storefrontBrandStyle } from "@/lib/storefront/branding";
import { storefrontPath } from "@/lib/storefront/resolver";
import type { StorefrontListingData } from "@/lib/storefront/types";

export function StorefrontListingPage({
  storefront,
  branding,
  locationLabel,
  properties,
  categories,
}: StorefrontListingData) {
  const [activeCategory, setActiveCategory] = useState("All Properties");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const filteredProperties = useMemo(() => {
    if (activeCategory === "All Properties") {
      return properties;
    }

    return properties.filter((property) => property.type === activeCategory);
  }, [activeCategory, properties]);

  const hasPublishedProperties = properties.length > 0;

  return (
    <div
      className="min-h-screen bg-surface-muted"
      style={storefrontBrandStyle(branding)}
    >
      <div className="pointer-events-none fixed inset-0 opacity-[0.035] [background-image:var(--storefront-pattern-url)] [background-size:160px_auto]" />
      <Navbar
        homeHref={storefrontPath({ orgSlug: storefront.orgSlug, storeSlug: storefront.slug })}
        branding={branding}
      />

      {categories.length > 1 ? (
        <CategoryBar
          categories={categories}
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
        />
      ) : null}

      <main className="mx-auto max-w-[1400px] px-6 py-8 lg:px-10 sm:py-10">
        <ListingHeader
          title={storefront.name}
          locationLabel={locationLabel}
          resultCount={filteredProperties.length}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
        />
        <PropertyGrid
          properties={filteredProperties}
          orgSlug={storefront.orgSlug}
          storeSlug={storefront.slug}
          emptyTitle={hasPublishedProperties ? "No properties found" : "No properties published yet"}
          emptyDescription={
            hasPublishedProperties
              ? "Try adjusting your filters or browse all categories to discover available listings."
              : "This storefront is live, but no properties have been published to it yet."
          }
        />

        <div className="h-16" />
      </main>

      <StorefrontFooter branding={branding} />
    </div>
  );
}
