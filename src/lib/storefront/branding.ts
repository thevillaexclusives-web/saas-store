import type { CSSProperties } from "react";
import type { StorefrontBranding } from "@/lib/storefront/types";

const DEFAULT_PRIMARY_COLOR = "#96693a";
const DEFAULT_ACCENT_COLOR = "#38b8bc";
const DEFAULT_DARK_COLOR = "#111111";
const DEFAULT_SECONDARY_COLOR = "#ffffff";
const DEFAULT_NEUTRAL_COLOR = "#57534e";
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
  const primaryColor = normalizeHexColor(
    branding?.colors?.primary ?? branding?.primaryColor,
    DEFAULT_PRIMARY_COLOR,
  );
  const lightColor = normalizeHexColor(
    branding?.colors?.light ?? branding?.secondaryColor,
    DEFAULT_SECONDARY_COLOR,
  );
  const primaryLogo = branding?.logos?.primary?.trim() || branding?.logoUrl?.trim() || null;
  const horizontalLogo = branding?.logos?.horizontal?.trim() || null;
  const iconLogo = branding?.logos?.icon?.trim() || null;
  const reversedLogo = branding?.logos?.reversed?.trim() || null;
  const favicon = branding?.logos?.favicon?.trim() || null;
  const pattern = branding?.logos?.pattern?.trim() || null;
  const socialImage = branding?.logos?.socialImage?.trim() || null;

  return {
    name: branding?.name?.trim() || DEFAULT_BRAND_NAME,
    tagline: branding?.tagline?.trim() || null,
    logoUrl: horizontalLogo || primaryLogo || iconLogo,
    primaryColor,
    secondaryColor: lightColor,
    brandDisplay:
      branding?.brandDisplay === "name_only" ||
      branding?.brandDisplay === "logo_only" ||
      branding?.brandDisplay === "logo_and_name"
        ? branding.brandDisplay
        : DEFAULT_BRAND_DISPLAY,
    logos: {
      primary: primaryLogo,
      horizontal: horizontalLogo,
      icon: iconLogo,
      reversed: reversedLogo,
      favicon,
      pattern,
      socialImage,
    },
    colors: {
      primary: primaryColor,
      accent: normalizeHexColor(branding?.colors?.accent, DEFAULT_ACCENT_COLOR),
      dark: normalizeHexColor(branding?.colors?.dark, DEFAULT_DARK_COLOR),
      light: lightColor,
      neutral: normalizeHexColor(branding?.colors?.neutral, DEFAULT_NEUTRAL_COLOR),
    },
    typographyPreset:
      branding?.typographyPreset === "editorial_serif" || branding?.typographyPreset === "clean_sans"
        ? branding.typographyPreset
        : "modern_sans",
    stylePreset:
      branding?.stylePreset === "editorial" || branding?.stylePreset === "minimal"
        ? branding.stylePreset
        : "modern_luxury",
    cornerStyle:
      branding?.cornerStyle === "sharp" || branding?.cornerStyle === "rounded"
        ? branding.cornerStyle
        : "soft",
  };
}

export function storefrontBrandStyle(branding?: Partial<StorefrontBranding> | null) {
  const normalized = normalizeStorefrontBranding(branding);
  const primaryHover = mix(normalized.primaryColor, "#000000", 0.12);
  const primaryActive = mix(normalized.primaryColor, "#000000", 0.2);
  const accentHover = mix(normalized.colors.accent, "#000000", 0.12);
  const soft = withAlpha(normalized.primaryColor, 0.12);
  const softStrong = withAlpha(normalized.primaryColor, 0.18);
  const border = withAlpha(normalized.primaryColor, 0.28);
  const secondarySurface = mix(normalized.secondaryColor, "#ffffff", 0.88);
  const secondarySurfaceStrong = mix(normalized.secondaryColor, "#ffffff", 0.78);
  const cardRadius =
    normalized.cornerStyle === "sharp"
      ? "0.5rem"
      : normalized.cornerStyle === "rounded"
        ? "1.75rem"
        : "1.25rem";
  const buttonRadius = normalized.cornerStyle === "rounded" ? "9999px" : cardRadius;

  return {
    "--storefront-primary": normalized.primaryColor,
    "--storefront-primary-foreground": textColor(normalized.primaryColor),
    "--storefront-primary-hover": primaryHover,
    "--storefront-primary-active": primaryActive,
    "--storefront-primary-soft": soft,
    "--storefront-primary-soft-strong": softStrong,
    "--storefront-primary-border": border,
    "--storefront-accent": normalized.colors.accent,
    "--storefront-accent-foreground": textColor(normalized.colors.accent),
    "--storefront-accent-hover": accentHover,
    "--storefront-dark": normalized.colors.dark,
    "--storefront-light": normalized.colors.light,
    "--storefront-neutral": normalized.colors.neutral,
    "--storefront-secondary": normalized.secondaryColor,
    "--storefront-secondary-foreground": textColor(normalized.secondaryColor),
    "--storefront-secondary-surface": secondarySurface,
    "--storefront-secondary-surface-strong": secondarySurfaceStrong,
    "--storefront-surface": normalized.colors.light,
    "--storefront-muted": secondarySurface,
    "--storefront-border": withAlpha(normalized.colors.neutral, 0.2),
    "--storefront-radius-card": cardRadius,
    "--storefront-radius-button": buttonRadius,
    "--storefront-pattern-url": normalized.logos.pattern ? `url(${normalized.logos.pattern})` : "none",
  } as CSSProperties;
}
