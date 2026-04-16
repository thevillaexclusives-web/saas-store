import { NextResponse } from "next/server";
import {
  checkStorefrontAvailability,
  quoteStorefrontReservation,
  resolveReservationTarget,
} from "@/lib/storefront/reservations";

interface RouteContext {
  params: Promise<{ orgSlug: string; storeSlug: string; propertyId: string }>;
}

export async function GET(request: Request, context: RouteContext) {
  const { orgSlug, storeSlug, propertyId } = await context.params;
  const url = new URL(request.url);
  const startDate = url.searchParams.get("start");
  const endDate = url.searchParams.get("end");
  const adults = Number(url.searchParams.get("adults") ?? "1");
  const children = Number(url.searchParams.get("children") ?? "0");

  if (!startDate || !endDate) {
    return NextResponse.json({ error: "start and end are required." }, { status: 400 });
  }

  try {
    const target = await resolveReservationTarget({ orgSlug, storeSlug, propertyId });
    if (!target) {
      return NextResponse.json({ error: "Property not found." }, { status: 404 });
    }

    const available = await checkStorefrontAvailability({
      propertyId: target.property.id,
      startDate,
      endDate,
    });
    const { quote, currency } = quoteStorefrontReservation({
      target,
      startDate,
      endDate,
      adults,
      children,
    });

    return NextResponse.json({
      available,
      currency,
      quote,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to check availability." },
      { status: 400 },
    );
  }
}
