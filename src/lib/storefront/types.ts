export type StorefrontBrandDisplayMode = "logo_and_name" | "name_only" | "logo_only";

export interface Storefront {
  id: string;
  name: string;
  slug: string;
  orgSlug: string;
}

export interface StorefrontBranding {
  name: string;
  logoUrl: string | null;
  primaryColor: string;
  secondaryColor: string;
  brandDisplay: StorefrontBrandDisplayMode;
}

export interface StorefrontCategory {
  name: string;
  icon: string;
  count: number;
}

export interface Amenity {
  name: string;
  icon: string;
  category: "essentials" | "outdoor" | "entertainment" | "safety";
}

export interface Host {
  name: string;
  avatar: string | null;
  responseRate: number | null;
  responseTime: string | null;
  superhost: boolean;
  joined: string | null;
  company: string | null;
  email: string | null;
}

export interface StorefrontProperty {
  id: string;
  storefrontId: string;
  name: string;
  type: string;
  location: string;
  city: string;
  country: string;
  price: number | null;
  currency: string;
  period: string;
  guests: number;
  bedrooms: number;
  bathrooms: number;
  latitude?: number | null;
  longitude?: number | null;
  rating: number | null;
  reviewCount: number | null;
  image: string;
  gallery: string[];
  features: string[];
  isFeatured?: boolean;
  description?: string;
  amenities?: Amenity[];
  host?: Host | null;
  yearBuilt?: number | null;
  areaSqm?: number | null;
  highlights?: string[];
}

export interface StorefrontListingData {
  storefront: Storefront;
  branding: StorefrontBranding;
  locationLabel: string;
  properties: StorefrontProperty[];
  categories: StorefrontCategory[];
}

export interface StorefrontPropertyDetailData extends StorefrontListingData {
  property: StorefrontProperty;
  similar: StorefrontProperty[];
}
