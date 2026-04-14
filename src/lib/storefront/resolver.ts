export interface StorefrontTarget {
  orgSlug: string;
  storeSlug: string;
  source: "route";
}

function normalizeSlug(value: string | null | undefined) {
  if (!value) {
    return null;
  }

  const normalized = value.trim().toLowerCase();
  return normalized.length > 0 ? normalized : null;
}

export function resolveStorefrontTarget(input: {
  routeOrgSlug?: string | null;
  routeStoreSlug?: string | null;
  host?: string | null;
}): StorefrontTarget | null {
  const routeOrgSlug = normalizeSlug(input.routeOrgSlug);
  const routeStoreSlug = normalizeSlug(input.routeStoreSlug);

  if (routeOrgSlug && routeStoreSlug) {
    return {
      orgSlug: routeOrgSlug,
      storeSlug: routeStoreSlug,
      source: "route",
    };
  }

  return null;
}

export function storefrontPath(target: Pick<StorefrontTarget, "orgSlug" | "storeSlug">) {
  return `/${target.orgSlug}/store/${target.storeSlug}`;
}

export function storefrontPropertyPath(
  target: Pick<StorefrontTarget, "orgSlug" | "storeSlug"> & { propertyId: string },
) {
  return `${storefrontPath(target)}/property/${target.propertyId}`;
}
