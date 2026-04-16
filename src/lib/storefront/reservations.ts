import "server-only";

import { calculateReservationQuote } from "@/lib/reservations/pricing";

const PROPERTY_SELECT =
  "id,org_id,storefront_id,name,price,currency,status,deleted_at";

interface RawOrganization {
  id: string;
  slug: string;
}

interface RawStorefront {
  id: string;
  org_id: string;
  slug: string;
}

interface RawProperty {
  id: string;
  org_id: string;
  storefront_id: string | null;
  name: string;
  price: number | string | null;
  currency: string | null;
  status: string;
  deleted_at: string | null;
}

interface RawBookingSettings {
  property_id: string;
  booking_enabled: boolean;
  booking_mode: "request_to_book" | "inquiry_only" | "disabled";
  base_nightly_rate: number | string | null;
  currency: string;
  minimum_nights: number | string;
  cleaning_fee: number | string;
  service_fee_type: "flat" | "per_night" | "percentage";
  service_fee_value: number | string;
  tax_rate: number | string;
  security_deposit: number | string;
  extra_guest_fee: number | string;
  included_guests: number | string;
}

export interface StorefrontReservationTarget {
  org: RawOrganization;
  storefront: RawStorefront;
  property: RawProperty;
  settings: RawBookingSettings | null;
}

function requireEnv(name: string, value: string | undefined) {
  if (!value) {
    throw new Error(`${name} is required for storefront reservation requests.`);
  }

  return value;
}

function getSupabaseUrl() {
  return requireEnv("NEXT_PUBLIC_SUPABASE_URL", process.env.NEXT_PUBLIC_SUPABASE_URL);
}

function getServiceRoleKey() {
  return requireEnv("SUPABASE_SERVICE_ROLE_KEY", process.env.SUPABASE_SERVICE_ROLE_KEY);
}

function toNumber(value: unknown, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function stringOrNull(value: unknown) {
  const text = typeof value === "string" ? value.trim() : "";
  return text || null;
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
    throw new Error(await response.text());
  }

  return (await response.json()) as T[];
}

async function insertRows<T>(table: string, rows: unknown[]) {
  const response = await fetch(`${getSupabaseUrl()}/rest/v1/${table}`, {
    method: "POST",
    headers: {
      apikey: getServiceRoleKey(),
      Authorization: `Bearer ${getServiceRoleKey()}`,
      Accept: "application/json",
      "Content-Type": "application/json",
      Prefer: "return=representation",
    },
    body: JSON.stringify(rows),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(await response.text());
  }

  return (await response.json()) as T[];
}

export async function resolveReservationTarget(input: {
  orgSlug: string;
  storeSlug: string;
  propertyId: string;
}): Promise<StorefrontReservationTarget | null> {
  const [org] = await fetchRows<RawOrganization>(
    "organizations",
    new URLSearchParams({
      select: "id,slug",
      slug: `eq.${input.orgSlug}`,
      limit: "1",
    }),
  );

  if (!org) {
    return null;
  }

  const [storefront] = await fetchRows<RawStorefront>(
    "storefronts",
    new URLSearchParams({
      select: "id,org_id,slug",
      org_id: `eq.${org.id}`,
      slug: `eq.${input.storeSlug}`,
      limit: "1",
    }),
  );

  if (!storefront) {
    return null;
  }

  const [property] = await fetchRows<RawProperty>(
    "properties",
    new URLSearchParams({
      select: PROPERTY_SELECT,
      id: `eq.${input.propertyId}`,
      org_id: `eq.${org.id}`,
      storefront_id: `eq.${storefront.id}`,
      status: "eq.active",
      deleted_at: "is.null",
      limit: "1",
    }),
  );

  if (!property) {
    return null;
  }

  const [settings] = await fetchRows<RawBookingSettings>(
    "property_booking_settings",
    new URLSearchParams({
      select:
        "property_id,booking_enabled,booking_mode,base_nightly_rate,currency,minimum_nights,cleaning_fee,service_fee_type,service_fee_value,tax_rate,security_deposit,extra_guest_fee,included_guests",
      property_id: `eq.${property.id}`,
      limit: "1",
    }),
  );

  return { org, storefront, property, settings: settings ?? null };
}

export async function checkStorefrontAvailability(input: {
  propertyId: string;
  startDate: string;
  endDate: string;
}) {
  const rows = await fetchRows<{ id: string }>(
    "property_reservations",
    new URLSearchParams({
      select: "id",
      property_id: `eq.${input.propertyId}`,
      status: "eq.confirmed",
      deleted_at: "is.null",
      start_date: `lt.${input.endDate}`,
      end_date: `gt.${input.startDate}`,
      limit: "1",
    }),
  );

  return rows.length === 0;
}

export function quoteStorefrontReservation(input: {
  target: StorefrontReservationTarget;
  startDate: string;
  endDate: string;
  adults: number;
  children: number;
}) {
  const settings = input.target.settings;
  const nightlyRate = toNumber(settings?.base_nightly_rate ?? input.target.property.price);
  const currency = settings?.currency ?? input.target.property.currency ?? "USD";
  const minimumNights = toNumber(settings?.minimum_nights, 1);
  const guests = input.adults + input.children;
  const includedGuests = toNumber(settings?.included_guests, 2);
  const extraGuests = Math.max(0, guests - includedGuests);
  const fees = [
    {
      kind: "cleaning" as const,
      label: "Cleaning fee",
      calculationType: "flat" as const,
      rate: toNumber(settings?.cleaning_fee),
    },
    {
      kind: "service" as const,
      label: "Service fee",
      calculationType: settings?.service_fee_type ?? ("percentage" as const),
      rate: toNumber(settings?.service_fee_value),
    },
    {
      kind: "tax" as const,
      label: "Taxes",
      calculationType: "percentage" as const,
      rate: toNumber(settings?.tax_rate),
    },
    {
      kind: "security_deposit" as const,
      label: "Security deposit",
      calculationType: "flat" as const,
      rate: toNumber(settings?.security_deposit),
    },
    {
      kind: "extra_guest" as const,
      label: "Extra guest fee",
      calculationType: "per_night" as const,
      rate: toNumber(settings?.extra_guest_fee) * extraGuests,
    },
  ];

  return {
    currency,
    nightlyRate,
    quote: calculateReservationQuote({
      startDate: input.startDate,
      endDate: input.endDate,
      nightlyRate,
      minimumNights,
      fees,
    }),
  };
}

export async function createStorefrontReservationRequest(input: {
  target: StorefrontReservationTarget;
  guestName: string;
  guestEmail?: string | null;
  guestPhone?: string | null;
  startDate: string;
  endDate: string;
  adults: number;
  children: number;
  guestNotes?: string | null;
}) {
  if (
    input.target.settings &&
    (!input.target.settings.booking_enabled ||
      input.target.settings.booking_mode === "disabled" ||
      input.target.settings.booking_mode === "inquiry_only")
  ) {
    throw new Error("Online booking requests are not enabled for this property.");
  }

  const available = await checkStorefrontAvailability({
    propertyId: input.target.property.id,
    startDate: input.startDate,
    endDate: input.endDate,
  });

  if (!available) {
    throw new Error("Those dates are no longer available.");
  }

  const { currency, nightlyRate, quote } = quoteStorefrontReservation({
    target: input.target,
    startDate: input.startDate,
    endDate: input.endDate,
    adults: input.adults,
    children: input.children,
  });

  const [reservation] = await insertRows<{ id: string }>("property_reservations", [
    {
      org_id: input.target.org.id,
      property_id: input.target.property.id,
      storefront_id: input.target.storefront.id,
      status: "pending",
      type: "guest_booking",
      source: "storefront",
      guest_name: input.guestName.trim(),
      guest_email: stringOrNull(input.guestEmail),
      guest_phone: stringOrNull(input.guestPhone),
      start_date: input.startDate,
      end_date: input.endDate,
      nights: quote.nights,
      adults: input.adults,
      children: input.children,
      currency,
      nightly_rate: nightlyRate,
      nightly_subtotal: quote.nightlySubtotal,
      fees_total: quote.feesTotal,
      discount_total: quote.discountTotal,
      tax_total: quote.taxTotal,
      total_amount: quote.totalAmount,
      guest_notes: stringOrNull(input.guestNotes),
    },
  ]);

  if (quote.fees.length > 0) {
    await insertRows("property_reservation_fees", quote.fees.map((fee) => ({
      ...fee,
      org_id: input.target.org.id,
      reservation_id: reservation.id,
    })));
  }

  return {
    reservationId: reservation.id,
    quote,
    currency,
  };
}
