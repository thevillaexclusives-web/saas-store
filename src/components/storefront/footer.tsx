import Image from "next/image";
import { normalizeStorefrontBranding } from "@/lib/storefront/branding";
import type { StorefrontBranding } from "@/lib/storefront/types";

export function StorefrontFooter({ branding }: { branding?: StorefrontBranding }) {
  const brand = normalizeStorefrontBranding(branding);
  const showLogo = brand.brandDisplay !== "name_only" && Boolean(brand.logoUrl);
  const showFallbackIcon = brand.brandDisplay === "logo_and_name" && !brand.logoUrl;
  const showName = brand.brandDisplay !== "logo_only" || !brand.logoUrl;

  return (
    <footer className="border-t border-border-subtle bg-[var(--storefront-secondary-surface)]">
      <div className="mx-auto max-w-[1400px] px-6 py-8 lg:px-10">
        <div className="flex flex-col items-center justify-between gap-4 text-sm text-stone-500 sm:flex-row">
          <div className="flex items-center gap-2">
            {showLogo ? (
              <div className="relative flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden">
                <Image
                  src={brand.logoUrl!}
                  alt={`${brand.name} logo`}
                  fill
                  sizes="36px"
                  className="object-contain"
                />
              </div>
            ) : showFallbackIcon ? (
              <div className="relative flex h-6 w-6 items-center justify-center overflow-hidden rounded-lg bg-[var(--storefront-primary)]">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  className="h-3.5 w-3.5 text-[var(--storefront-primary-foreground)]"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                </svg>
              </div>
            ) : null}
            {showName ? <span className="font-semibold text-stone-700">{brand.name}</span> : null}
          </div>
          <p>&copy; {new Date().getFullYear()} {brand.name}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
