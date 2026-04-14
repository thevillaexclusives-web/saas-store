import type { CSSProperties } from "react";
import type { StorefrontBranding } from "@/lib/storefront/types";

const DEFAULT_PRIMARY_COLOR = "#96693a";
const DEFAULT_SECONDARY_COLOR = "#ffffff";
const DEFAULT_BRAND_NAME = "VillaHub";
const DEFAULT_BRAND_DISPLAY = "logo_and_name";

function normalizeHexColor(value: string | null | undefined, fallback: string) {
  const trimmed = value?.trim() ?? "";
  const normalized = trimmed.startsWith("#") ? trimmed : `#${trimmed}`;
  return /^#[0-9a-fA-F]{6}$/.test(normalized) ? normalized.toLowerCase() : fallback;
}

function toRgb(hex: string) {
  return {
    red: Number.parseInt(hex.slice(1, 3), 16),
    green: Number.parseInt(hex.slice(3, 5), 16),
    blue: Number.parseInt(hex.slice(5, 7), 16),
  };
}

function withAlpha(hex: string, alpha: number) {
  const { red, green, blue } = toRgb(hex);
  return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
}

function mix(hex: string, targetHex: string, amount: number) {
  const source = toRgb(hex);
  const target = toRgb(targetHex);
  const mixChannel = (left: number, right: number) =>
    Math.round(left + (right - left) * amount)
      .toString(16)
      .padStart(2, "0");

  return `#${mixChannel(source.red, target.red)}${mixChannel(source.green, target.green)}${mixChannel(source.blue, target.blue)}`;
}

function textColor(hex: string) {
  const { red, green, blue } = toRgb(hex);
  const luminance = (red * 299 + green * 587 + blue * 114) / 1000;
  return luminance >= 150 ? "#111111" : "#ffffff";
}

export function normalizeStorefrontBranding(
  branding?: Partial<StorefrontBranding> | null,
): StorefrontBranding {
  return {
    name: branding?.name?.trim() || DEFAULT_BRAND_NAME,
    logoUrl: branding?.logoUrl?.trim() || null,
    primaryColor: normalizeHexColor(branding?.primaryColor, DEFAULT_PRIMARY_COLOR),
    secondaryColor: normalizeHexColor(branding?.secondaryColor, DEFAULT_SECONDARY_COLOR),
    brandDisplay:
      branding?.brandDisplay === "name_only" ||
      branding?.brandDisplay === "logo_only" ||
      branding?.brandDisplay === "logo_and_name"
        ? branding.brandDisplay
        : DEFAULT_BRAND_DISPLAY,
  };
}

export function storefrontBrandStyle(branding?: Partial<StorefrontBranding> | null) {
  const normalized = normalizeStorefrontBranding(branding);
  const primaryHover = mix(normalized.primaryColor, "#000000", 0.12);
  const primaryActive = mix(normalized.primaryColor, "#000000", 0.2);
  const soft = withAlpha(normalized.primaryColor, 0.12);
  const softStrong = withAlpha(normalized.primaryColor, 0.18);
  const border = withAlpha(normalized.primaryColor, 0.28);
  const secondarySurface = mix(normalized.secondaryColor, "#ffffff", 0.88);
  const secondarySurfaceStrong = mix(normalized.secondaryColor, "#ffffff", 0.78);

  return {
    "--storefront-primary": normalized.primaryColor,
    "--storefront-primary-foreground": textColor(normalized.primaryColor),
    "--storefront-primary-hover": primaryHover,
    "--storefront-primary-active": primaryActive,
    "--storefront-primary-soft": soft,
    "--storefront-primary-soft-strong": softStrong,
    "--storefront-primary-border": border,
    "--storefront-secondary": normalized.secondaryColor,
    "--storefront-secondary-foreground": textColor(normalized.secondaryColor),
    "--storefront-secondary-surface": secondarySurface,
    "--storefront-secondary-surface-strong": secondarySurfaceStrong,
  } as CSSProperties;
}
