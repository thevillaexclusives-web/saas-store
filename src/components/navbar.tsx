"use client";

import Image from "next/image";
import Link from "next/link";
import { Search, ChevronDown, Globe } from "lucide-react";
import { normalizeStorefrontBranding } from "@/lib/storefront/branding";
import type { StorefrontBranding } from "@/lib/storefront/types";
import { cn } from "@/lib/utils";

const navTabs = ["Buy", "Sell", "Rent"] as const;

function brandInitials(name: string) {
  const initials = name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");

  return initials || "VH";
}

export function Navbar({
  homeHref = "/",
  branding,
}: {
  homeHref?: string;
  branding?: StorefrontBranding;
}) {
  const brand = normalizeStorefrontBranding(branding);
  const logoUrl = brand.logos.horizontal || brand.logos.primary || brand.logoUrl;
  const iconUrl = brand.logos.icon || brand.logos.favicon;
  const showLogo = brand.brandDisplay !== "name_only" && Boolean(logoUrl);
  const showIcon = brand.brandDisplay !== "name_only" && !showLogo && Boolean(iconUrl);
  const showFallbackIcon = brand.brandDisplay === "logo_and_name" && !showLogo && !showIcon;
  const showName = brand.brandDisplay !== "logo_only" || (!logoUrl && !iconUrl);

  return (
    <header className="sticky top-0 z-50 border-b border-border-subtle bg-[var(--storefront-secondary-surface)] backdrop-blur-xl">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <div className="flex h-[72px] items-center justify-between gap-6">
          {/* Logo */}
          <Link href={homeHref} className="flex items-center gap-2 shrink-0">
            {showLogo ? (
              <div className="relative flex h-14 w-32 shrink-0 items-center justify-center overflow-hidden sm:h-16 sm:w-40">
                <Image
                  src={logoUrl!}
                  alt={`${brand.name} logo`}
                  fill
                  sizes="(max-width: 640px) 120px, 160px"
                  className="object-contain"
                />
              </div>
            ) : showIcon ? (
              <div className="relative flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden">
                <Image
                  src={iconUrl!}
                  alt={`${brand.name} icon`}
                  fill
                  sizes="36px"
                  className="object-contain"
                />
              </div>
            ) : showFallbackIcon ? (
              <div className="relative flex h-9 w-9 items-center justify-center overflow-hidden bg-[var(--storefront-primary)] shadow-sm [border-radius:var(--storefront-radius-card)]">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  className="w-5 h-5 text-[var(--storefront-primary-foreground)]"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                  <polyline points="9 22 9 12 15 12 15 22" />
                </svg>
                <span className="sr-only">{brandInitials(brand.name)}</span>
              </div>
            ) : null}
            {showName ? (
              <span className="text-xl font-bold tracking-tight text-stone-900">{brand.name}</span>
            ) : (
              <span className="sr-only">{brand.name}</span>
            )}
          </Link>

          {/* Search bar */}
          <div className="hidden md:flex flex-1 max-w-xl">
            <div className="relative w-full group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-stone-400 transition-colors group-focus-within:text-[var(--storefront-primary)]" />
              <input
                type="text"
                placeholder="Search destinations, properties..."
                className="w-full h-11 rounded-full border border-border-subtle bg-[var(--storefront-secondary-surface-strong)] pl-11 pr-4 text-sm text-stone-800 placeholder:text-stone-400 transition-all focus:border-[var(--storefront-primary-border)] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[var(--storefront-primary-soft)]"
              />
            </div>
          </div>

          {/* Navigation tabs */}
          <nav className="hidden lg:flex items-center rounded-full bg-[var(--storefront-secondary-surface-strong)] p-1">
            {navTabs.map((tab, i) => (
              <button
                key={tab}
                className={cn(
                  "px-5 py-2 text-sm font-medium rounded-full transition-all",
                  i === 2
                    ? "bg-[var(--storefront-primary)] text-[var(--storefront-primary-foreground)] shadow-sm"
                    : "text-stone-500 hover:text-[var(--storefront-primary)]"
                )}
              >
                {tab}
              </button>
            ))}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-3 shrink-0">
            <button className="hidden sm:flex items-center gap-1.5 px-3 py-2 text-sm text-stone-600 hover:text-stone-800 transition-colors">
              <Globe className="w-4 h-4" />
              <span>USD</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </button>

            <a
              href={`${process.env.NEXT_PUBLIC_PLATFORM_URL}/login`}
              className="inline-flex h-10 items-center bg-[var(--storefront-primary)] px-6 text-sm font-semibold text-[var(--storefront-primary-foreground)] transition-all hover:bg-[var(--storefront-primary-hover)] active:scale-[0.97] [border-radius:var(--storefront-radius-button)]"
            >
              Login
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
