import "server-only";

import { cache } from "react";
import type {
  Amenity,
  Host,
  StorefrontBranding,
  Storefront,
  StorefrontListingData,
  StorefrontProperty,
  StorefrontPropertyDetailData,
} from "@/lib/storefront/types";
import {
  resolveStorefrontBranding,
  type RawBrandKit,
} from "@/lib/storefront/brand-resolver";
import type { StorefrontTarget } from "@/lib/storefront/resolver";

const PROPERTY_UPLOAD_BUCKET = "platform-uploads";
const BRAND_ASSETS_BUCKET = "brand-assets";

interface RawStorefront {
  id: string;
  org_id: string;
  name: string;
  slug: string;
  brand_kit_id: string | null;
}

interface RawOrganization {
  id: string;
  name: string;
  slug: string;
  logo_url: string | null;
  primary_color: string | null;
  secondary_color: string | null;
  default_brand_kit_id: string | null;
  settings: Record<string, unknown> | null;
}

interface RawPropertyType {
  id: string;
  name: string;
  description: string | null;
}

interface RawMarket {
  id: string;
  country: string;
  state_province: string | null;
  city: string | null;
}

interface RawArea {
  id: string;
  market_id: string;
  name: string;
}

interface RawContact {
  id: string;
  first_name: string;
  last_name: string | null;
  email: string | null;
  company: string | null;
}

interface RawFeature {
  id: string;
  name: string;
  category: string | null;
  category_type: "interior" | "exterior" | "location";
  icon: string | null;
  created_at: string;
}

interface RawPropertyFeature {
  id: string;
  property_id: string;
  feature_id: string;
  value: string | null;
}

interface RawPropertyMedia {
  id: string;
  property_id: string;
  file_path: string;
  file_name: string;
  mime_type: string;
  is_primary: boolean;
  sort_order: number | string;
  title: string | null;
  description: string | null;
  created_at: string;
}

interface RawPropertyRow {
  id: string;
  storefront_id: string | null;
  name: string;
  description: string | null;
  bedrooms: number | string | null;
  bathrooms: number | string | null;
  sleeps: number | string | null;
  year_built: number | string | null;
  unit_size: number | string | null;
  unit_size_unit: "sqm" | "sqft" | null;
  city: string | null;
  country: string | null;
  latitude: number | string | null;
  longitude: number | string | null;
  price: number | string | null;
  currency: string | null;
  is_vip: boolean | null;
  property_type_id: string | null;
  market_id: string | null;
  area_id: string | null;
  owner_id: string | null;
  agent_id: string | null;
}

interface StorefrontLookupData {
  propertyTypes: Map<string, RawPropertyType>;
  markets: Map<string, RawMarket>;
  areas: Map<string, RawArea>;
  contacts: Map<string, RawContact>;
  features: Map<string, RawFeature>;
  propertyFeaturesByPropertyId: Map<string, RawPropertyFeature[]>;
  propertyMediaByPropertyId: Map<string, RawPropertyMedia[]>;
}

function requireEnv(name: string, value: string | undefined) {
  if (!value) {
    throw new Error(`${name} is required for storefront data fetching.`);
  }

  return value;
}

function getSupabaseUrl() {
  return requireEnv("NEXT_PUBLIC_SUPABASE_URL", process.env.NEXT_PUBLIC_SUPABASE_URL);
}

function getServiceRoleKey() {
  return requireEnv("SUPABASE_SERVICE_ROLE_KEY", process.env.SUPABASE_SERVICE_ROLE_KEY);
}

function toNumber(value: unknown) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function toNullableNumber(value: unknown) {
  if (value == null || value === "") {
    return null;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function publicStorageUrl(filePath: string) {
  if (filePath.startsWith("http://") || filePath.startsWith("https://")) {
    return filePath;
  }

  return `${getSupabaseUrl()}/storage/v1/object/public/${PROPERTY_UPLOAD_BUCKET}/${filePath}`;
}

function placeholderSvg(label: string, variant: "property" | "host") {
  const initials = label
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((item) => item[0]?.toUpperCase() ?? "")
    .join("");
  const text = initials || (variant === "host" ? "VH" : "VP");
  const primary = variant === "host" ? "#7a5232" : "#b08445";
  const secondary = variant === "host" ? "#f5ead6" : "#f8f7f5";
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800" viewBox="0 0 1200 800">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${secondary}" />
          <stop offset="100%" stop-color="#e7e5e4" />
        </linearGradient>
      </defs>
      <rect width="1200" height="800" fill="url(#bg)" />
      <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="${primary}" font-family="Arial, sans-serif" font-size="180" font-weight="700">${text}</text>
    </svg>
  `;

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

function buildInFilter(values: string[]) {
  return `in.(${values.join(",")})`;
}

function categoryIcon(name: string) {
  const normalized = name.toLowerCase();

  if (normalized.includes("apartment")) return "building-2";
  if (normalized.includes("townhouse")) return "house";
  if (normalized.includes("condo")) return "building";
  if (normalized.includes("house")) return "warehouse";
  return "home";
}

function featureIcon(
  name: string,
  categoryType: "interior" | "exterior" | "location",
): Amenity["icon"] {
  const normalized = name.toLowerCase();

  if (normalized.includes("pool")) return "waves";
  if (normalized.includes("jacuzzi") || normalized.includes("spa")) return "sparkles";
  if (normalized.includes("beach")) return "umbrella";
  if (normalized.includes("wifi") || normalized.includes("internet")) return "wifi";
  if (normalized.includes("kitchen")) return "cooking-pot";
  if (normalized.includes("tv")) return "tv";
  if (normalized.includes("bbq") || normalized.includes("grill")) return "flame";
  if (normalized.includes("security")) return "shield";
  if (normalized.includes("parking")) return "car";
  if (normalized.includes("gym") || normalized.includes("fitness")) return "dumbbell";
  if (normalized.includes("concierge") || normalized.includes("service")) return "bell";
  if (normalized.includes("garden") || normalized.includes("tree")) return "trees";
  if (normalized.includes("sun") || normalized.includes("terrace")) return "sun";
  if (normalized.includes("wine") || normalized.includes("bar")) return "wine";

  if (categoryType === "location") return "umbrella";
  if (categoryType === "exterior") return "trees";
  return "sparkles";
}

function featureCategory(
  categoryType: "interior" | "exterior" | "location",
): Amenity["category"] {
  if (categoryType === "location" || categoryType === "exterior") {
    return "outdoor";
  }

  return "essentials";
}

function normalizeHost(contact: RawContact | undefined): Host | null {
  if (!contact) {
    return null;
  }

  const name = [contact.first_name, contact.last_name].filter(Boolean).join(" ") || contact.company;
  if (!name) {
    return null;
  }

  return {
    name,
    avatar: placeholderSvg(name, "host"),
    responseRate: null,
    responseTime: null,
    superhost: false,
    joined: null,
    company: contact.company ?? null,
    email: contact.email ?? null,
  };
}

function normalizeGallery(media: RawPropertyMedia[], propertyName: string) {
  const sortedMedia = [...media].sort((left, right) => {
    if (left.is_primary !== right.is_primary) {
      return left.is_primary ? -1 : 1;
    }

    return toNumber(left.sort_order) - toNumber(right.sort_order);
  });

  const urls = sortedMedia.map((item) => publicStorageUrl(item.file_path));
  return urls.length > 0 ? urls : [placeholderSvg(propertyName, "property")];
}

function normalizeAmenities(
  propertyFeatures: RawPropertyFeature[],
  features: Map<string, RawFeature>,
): Amenity[] {
  const uniqueAmenities = new Map<string, Amenity>();

  for (const item of propertyFeatures) {
    const feature = features.get(item.feature_id);
    if (!feature) {
      continue;
    }

    uniqueAmenities.set(feature.name, {
      name: feature.name,
      icon: featureIcon(feature.name, feature.category_type),
      category: featureCategory(feature.category_type),
    });
  }

  return Array.from(uniqueAmenities.values());
}

function normalizeLocation(
  property: RawPropertyRow,
  market: RawMarket | undefined,
  area: RawArea | undefined,
) {
  const location = area?.name ?? market?.city ?? property.city ?? property.country;
  const city = property.city ?? market?.city ?? market?.country ?? "Destination";
  const country = property.country ?? market?.country ?? "Destination";

  return {
    location: location ?? "Featured stay",
    city,
    country,
  };
}

function normalizeProperty(
  property: RawPropertyRow,
  lookups: StorefrontLookupData,
): StorefrontProperty {
  const propertyType = property.property_type_id
    ? lookups.propertyTypes.get(property.property_type_id)
    : undefined;
  const market = property.market_id ? lookups.markets.get(property.market_id) : undefined;
  const area = property.area_id ? lookups.areas.get(property.area_id) : undefined;
  const owner = property.owner_id ? lookups.contacts.get(property.owner_id) : undefined;
  const agent = property.agent_id ? lookups.contacts.get(property.agent_id) : undefined;
  const propertyFeatures = lookups.propertyFeaturesByPropertyId.get(property.id) ?? [];
  const propertyMedia = lookups.propertyMediaByPropertyId.get(property.id) ?? [];
  const gallery = normalizeGallery(propertyMedia, property.name);
  const featureNames = Array.from(
    new Set(
      propertyFeatures
        .map((item) => lookups.features.get(item.feature_id)?.name)
        .filter((value): value is string => Boolean(value)),
    ),
  );
  const location = normalizeLocation(property, market, area);
  const unitSize = toNullableNumber(property.unit_size);
  const areaSqm =
    property.unit_size_unit === "sqft" && unitSize != null
      ? Math.round(unitSize * 0.092903)
      : unitSize;

  return {
    id: property.id,
    storefrontId: property.storefront_id ?? "",
    name: property.name,
    type: propertyType?.name ?? "Property",
    location: location.location,
    city: location.city,
    country: location.country,
    price: toNullableNumber(property.price),
    currency: property.currency ?? "USD",
    period: "night",
    guests: toNullableNumber(property.sleeps) ?? Math.max(toNumber(property.bedrooms) * 2, 1),
    bedrooms: toNumber(property.bedrooms),
    bathrooms: toNumber(property.bathrooms),
    latitude: toNullableNumber(property.latitude),
    longitude: toNullableNumber(property.longitude),
    rating: null,
    reviewCount: null,
    image: gallery[0],
    gallery,
    features: featureNames,
    isFeatured: property.is_vip === true,
    description: property.description ?? undefined,
    amenities: normalizeAmenities(propertyFeatures, lookups.features),
    host: normalizeHost(owner ?? agent),
    yearBuilt: toNullableNumber(property.year_built),
    areaSqm,
    highlights: featureNames.slice(0, 4),
  };
}

function buildCategories(properties: StorefrontProperty[]) {
  const counts = new Map<string, number>();

  for (const property of properties) {
    counts.set(property.type, (counts.get(property.type) ?? 0) + 1);
  }

  return [
    {
      name: "All Properties",
      icon: "layout-grid",
      count: properties.length,
    },
    ...Array.from(counts.entries())
      .sort((left, right) => left[0].localeCompare(right[0]))
      .map(([name, count]) => ({
        name,
        icon: categoryIcon(name),
        count,
      })),
  ];
}

function buildLocationLabel(storefront: Storefront, properties: StorefrontProperty[]) {
  const places = Array.from(
    new Set(
      properties
        .map((property) => property.city)
        .filter((value) => value && value !== "Destination"),
    ),
  );

  return places.slice(0, 2).join(" · ") || storefront.name;
}

async function fetchRows<T>(table: string, params: URLSearchParams) {
  const response = await fetch(`${getSupabaseUrl()}/rest/v1/${table}?${params.toString()}`, {
    headers: {
      apikey: getServiceRoleKey(),
      Authorization: `Bearer ${getServiceRoleKey()}`,
      Accept: "application/json",
    },
    cache: "no-store",
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Storefront query failed for ${table}: ${response.status} ${response.statusText} ${errorText}`.trim(),
    );
  }

  return (await response.json()) as T[];
}

async function fetchOrganizationBySlug(slug: string) {
  const params = new URLSearchParams({
    select: "id,name,slug,logo_url,primary_color,secondary_color,default_brand_kit_id,settings",
    slug: `eq.${slug}`,
    limit: "1",
  });
  const [organization] = await fetchRows<RawOrganization>("organizations", params);
  return organization ?? null;
}

async function fetchStorefrontByOrgAndSlug(orgId: string, slug: string) {
  const params = new URLSearchParams({
    select: "id,org_id,name,slug,brand_kit_id",
    org_id: `eq.${orgId}`,
    slug: `eq.${slug}`,
    limit: "1",
  });
  const [storefront] = await fetchRows<RawStorefront>("storefronts", params);
  return storefront ?? null;
}

async function fetchBrandKitById(id: string | null | undefined) {
  if (!id) {
    return null;
  }

  try {
    const [brandKit] = await fetchRows<RawBrandKit>(
      "brand_kits",
      new URLSearchParams({
        select:
          "id,brand_name,tagline,primary_color,accent_color,dark_color,light_color,neutral_color,gradient_from,gradient_to,typography_preset,style_preset,corner_style,settings,brand_assets(kind,file_path)",
        id: `eq.${id}`,
        status: "neq.archived",
        limit: "1",
      }),
    );

    return brandKit ?? null;
  } catch {
    return null;
  }
}

async function fetchStorefrontProperties(storefrontId: string) {
  const params = new URLSearchParams({
    select:
      "id,storefront_id,name,description,bedrooms,bathrooms,sleeps,year_built,unit_size,unit_size_unit,city,country,latitude,longitude,price,currency,is_vip,property_type_id,market_id,area_id,owner_id,agent_id",
    storefront_id: `eq.${storefrontId}`,
    deleted_at: "is.null",
    status: "eq.active",
  });
  params.append("order", "is_vip.desc");
  params.append("order", "updated_at.desc");

  return fetchRows<RawPropertyRow>("properties", params);
}

async function fetchLookupData(properties: RawPropertyRow[]): Promise<StorefrontLookupData> {
  const propertyIds = properties.map((property) => property.id);
  const propertyTypeIds = Array.from(
    new Set(properties.map((property) => property.property_type_id).filter(Boolean)),
  ) as string[];
  const marketIds = Array.from(
    new Set(properties.map((property) => property.market_id).filter(Boolean)),
  ) as string[];
  const areaIds = Array.from(
    new Set(properties.map((property) => property.area_id).filter(Boolean)),
  ) as string[];
  const contactIds = Array.from(
    new Set(
      properties
        .flatMap((property) => [property.owner_id, property.agent_id])
        .filter(Boolean),
    ),
  ) as string[];

  const propertyTypesPromise = propertyTypeIds.length
    ? fetchRows<RawPropertyType>(
        "property_types",
        new URLSearchParams({
          select: "id,name,description",
          id: buildInFilter(propertyTypeIds),
        }),
      )
    : Promise.resolve([]);

  const marketsPromise = marketIds.length
    ? fetchRows<RawMarket>(
        "markets",
        new URLSearchParams({
          select: "id,country,state_province,city",
          id: buildInFilter(marketIds),
        }),
      )
    : Promise.resolve([]);

  const areasPromise = areaIds.length
    ? fetchRows<RawArea>(
        "areas",
        new URLSearchParams({
          select: "id,market_id,name",
          id: buildInFilter(areaIds),
        }),
      )
    : Promise.resolve([]);

  const contactsPromise = contactIds.length
    ? fetchRows<RawContact>(
        "contacts",
        new URLSearchParams({
          select: "id,first_name,last_name,email,company",
          id: buildInFilter(contactIds),
        }),
      )
    : Promise.resolve([]);

  const propertyFeaturesPromise = propertyIds.length
    ? fetchRows<RawPropertyFeature>(
        "property_features",
        new URLSearchParams({
          select: "id,property_id,feature_id,value",
          property_id: buildInFilter(propertyIds),
        }),
      )
    : Promise.resolve([]);

  const propertyMediaPromise = propertyIds.length
    ? fetchRows<RawPropertyMedia>(
        "property_media",
        (() => {
          const params = new URLSearchParams({
            select:
              "id,property_id,file_path,file_name,mime_type,is_primary,sort_order,title,description,created_at",
            property_id: buildInFilter(propertyIds),
          });
          params.append("order", "is_primary.desc");
          params.append("order", "sort_order.asc");
          params.append("order", "created_at.asc");
          return params;
        })(),
      )
    : Promise.resolve([]);

  const [propertyTypes, markets, areas, contacts, propertyFeatures, propertyMedia] =
    await Promise.all([
      propertyTypesPromise,
      marketsPromise,
      areasPromise,
      contactsPromise,
      propertyFeaturesPromise,
      propertyMediaPromise,
    ]);

  const featureIds = Array.from(
    new Set(propertyFeatures.map((item) => item.feature_id).filter(Boolean)),
  );

  const features = featureIds.length
    ? await fetchRows<RawFeature>(
        "features",
        new URLSearchParams({
          select: "id,name,category,category_type,icon,created_at",
          id: buildInFilter(featureIds),
        }),
      )
    : [];

  return {
    propertyTypes: new Map(propertyTypes.map((item) => [item.id, item])),
    markets: new Map(markets.map((item) => [item.id, item])),
    areas: new Map(areas.map((item) => [item.id, item])),
    contacts: new Map(contacts.map((item) => [item.id, item])),
    features: new Map(features.map((item) => [item.id, item])),
    propertyFeaturesByPropertyId: propertyFeatures.reduce((map, item) => {
      const group = map.get(item.property_id) ?? [];
      group.push(item);
      map.set(item.property_id, group);
      return map;
    }, new Map<string, RawPropertyFeature[]>()),
    propertyMediaByPropertyId: propertyMedia.reduce((map, item) => {
      const group = map.get(item.property_id) ?? [];
      group.push(item);
      map.set(item.property_id, group);
      return map;
    }, new Map<string, RawPropertyMedia[]>()),
  };
}

const getStorefrontListingDataByTarget = cache(
  async (orgSlug: string, storeSlug: string): Promise<StorefrontListingData | null> => {
    const organization = await fetchOrganizationBySlug(orgSlug);
    if (!organization) {
      return null;
    }

    const storefrontRecord = await fetchStorefrontByOrgAndSlug(organization.id, storeSlug);
    if (!storefrontRecord) {
      return null;
    }

    const storefront: Storefront = {
      id: storefrontRecord.id,
      name: storefrontRecord.name,
      slug: storefrontRecord.slug,
      orgSlug: organization.slug,
    };
    const brandKit =
      (await fetchBrandKitById(storefrontRecord.brand_kit_id)) ??
      (await fetchBrandKitById(organization.default_brand_kit_id));
    const branding: StorefrontBranding = resolveStorefrontBranding({
      organization,
      brandKit,
      supabaseUrl: getSupabaseUrl(),
      brandAssetsBucket: BRAND_ASSETS_BUCKET,
    });

    const propertyRows = await fetchStorefrontProperties(storefront.id);
    const lookups = await fetchLookupData(propertyRows);
    const properties = propertyRows.map((property) => normalizeProperty(property, lookups));

      return {
        storefront,
        branding,
        locationLabel: buildLocationLabel(storefront, properties),
        properties,
        categories: buildCategories(properties),
    };
  },
);

export async function getStorefrontListingData(
  target: StorefrontTarget,
): Promise<StorefrontListingData | null> {
  return getStorefrontListingDataByTarget(target.orgSlug, target.storeSlug);
}

export async function getStorefrontPropertyDetailData(
  target: StorefrontTarget,
  propertyId: string,
): Promise<StorefrontPropertyDetailData | null> {
  const listingData = await getStorefrontListingData(target);
  if (!listingData) {
    return null;
  }

  const property = listingData.properties.find((item) => item.id === propertyId);
  if (!property) {
    return null;
  }

  return {
    ...listingData,
    property,
    similar: listingData.properties.filter((item) => item.id !== propertyId).slice(0, 3),
  };
}
