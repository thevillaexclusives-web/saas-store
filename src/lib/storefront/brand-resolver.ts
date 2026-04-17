import type { StorefrontBrandDisplayMode, StorefrontBranding } from "@/lib/storefront/types";

export interface RawBrandAsset {
  kind:
    | "primary_logo"
    | "horizontal_logo"
    | "icon_mark"
    | "reversed_logo"
    | "favicon"
    | "pattern"
    | "social_image";
  file_path: string;
}

export interface RawBrandKit {
  id: string;
  brand_name: string;
  tagline: string | null;
  primary_color: string | null;
  accent_color: string | null;
  dark_color: string | null;
  light_color: string | null;
  neutral_color: string | null;
  typography_preset: string | null;
  style_preset: string | null;
  corner_style: string | null;
  settings: Record<string, unknown> | null;
  brand_assets?: RawBrandAsset[] | null;
}

export interface LegacyOrganizationBranding {
  name: string;
  logo_url: string | null;
  primary_color: string | null;
  secondary_color: string | null;
  settings: Record<string, unknown> | null;
}

function brandDisplayFromSettings(
  settings: Record<string, unknown> | null | undefined,
): StorefrontBrandDisplayMode | null {
  const value =
    typeof settings?.storefront_brand_display === "string"
      ? settings.storefront_brand_display
      : typeof settings?.brand_display === "string"
        ? settings.brand_display
        : null;

  return value === "name_only" || value === "logo_only" || value === "logo_and_name"
    ? value
    : null;
}

function assetUrl(
  asset: RawBrandAsset | undefined,
  options: { supabaseUrl: string; bucket: string },
) {
  if (!asset?.file_path) {
    return null;
  }

  if (asset.file_path.startsWith("http://") || asset.file_path.startsWith("https://")) {
    return asset.file_path;
  }

  return `${options.supabaseUrl}/storage/v1/object/public/${options.bucket}/${asset.file_path}`;
}

function normalizePreset<T extends string>(value: string | null | undefined, allowed: T[], fallback: T) {
  return allowed.includes(value as T) ? (value as T) : fallback;
}

export function resolveStorefrontBranding(input: {
  organization: LegacyOrganizationBranding;
  brandKit: RawBrandKit | null;
  supabaseUrl: string;
  brandAssetsBucket?: string;
}): StorefrontBranding {
  const bucket = input.brandAssetsBucket ?? "brand-assets";
  const assets = new Map((input.brandKit?.brand_assets ?? []).map((asset) => [asset.kind, asset]));
  const legacyLogoUrl = input.organization.logo_url;
  const primaryLogo = assetUrl(assets.get("primary_logo"), {
    supabaseUrl: input.supabaseUrl,
    bucket,
  });
  const horizontalLogo = assetUrl(assets.get("horizontal_logo"), {
    supabaseUrl: input.supabaseUrl,
    bucket,
  });
  const iconLogo = assetUrl(assets.get("icon_mark"), {
    supabaseUrl: input.supabaseUrl,
    bucket,
  });
  const reversedLogo = assetUrl(assets.get("reversed_logo"), {
    supabaseUrl: input.supabaseUrl,
    bucket,
  });
  const favicon = assetUrl(assets.get("favicon"), {
    supabaseUrl: input.supabaseUrl,
    bucket,
  });
  const pattern = assetUrl(assets.get("pattern"), {
    supabaseUrl: input.supabaseUrl,
    bucket,
  });
  const socialImage = assetUrl(assets.get("social_image"), {
    supabaseUrl: input.supabaseUrl,
    bucket,
  });
  const brandDisplay =
    brandDisplayFromSettings(input.brandKit?.settings) ??
    brandDisplayFromSettings(input.organization.settings) ??
    "logo_and_name";

  return {
    name: input.brandKit?.brand_name || input.organization.name,
    tagline: input.brandKit?.tagline ?? null,
    logoUrl: horizontalLogo || primaryLogo || iconLogo || legacyLogoUrl,
    primaryColor:
      input.brandKit?.primary_color ?? input.organization.primary_color ?? "#96693a",
    secondaryColor:
      input.brandKit?.light_color ?? input.organization.secondary_color ?? "#ffffff",
    brandDisplay,
    logos: {
      primary: primaryLogo || legacyLogoUrl,
      horizontal: horizontalLogo,
      icon: iconLogo,
      reversed: reversedLogo,
      favicon,
      pattern,
      socialImage,
    },
    colors: {
      primary: input.brandKit?.primary_color ?? input.organization.primary_color ?? "#96693a",
      accent: input.brandKit?.accent_color ?? "#38b8bc",
      dark: input.brandKit?.dark_color ?? "#111111",
      light: input.brandKit?.light_color ?? input.organization.secondary_color ?? "#ffffff",
      neutral: input.brandKit?.neutral_color ?? "#57534e",
    },
    typographyPreset: normalizePreset(
      input.brandKit?.typography_preset,
      ["modern_sans", "editorial_serif", "clean_sans"],
      "modern_sans",
    ),
    stylePreset: normalizePreset(
      input.brandKit?.style_preset,
      ["modern_luxury", "editorial", "minimal"],
      "modern_luxury",
    ),
    cornerStyle: normalizePreset(
      input.brandKit?.corner_style,
      ["sharp", "soft", "rounded"],
      "soft",
    ),
  };
}
