import { NextResponse } from "next/server";
import {
  createStorefrontReservationRequest,
  resolveReservationTarget,
} from "@/lib/storefront/reservations";

interface RouteContext {
  params: Promise<{ orgSlug: string; storeSlug: string; propertyId: string }>;
}

export async function POST(request: Request, context: RouteContext) {
  const { orgSlug, storeSlug, propertyId } = await context.params;

  try {
    const body = (await request.json()) as {
      guestName?: string;
      guestEmail?: string;
      guestPhone?: string;
      startDate?: string;
      endDate?: string;
      adults?: number;
      children?: number;
      guestNotes?: string;
    };

    if (!body.guestName?.trim()) {
      return NextResponse.json({ error: "Guest name is required." }, { status: 400 });
    }

    if (!body.startDate || !body.endDate) {
      return NextResponse.json({ error: "Check-in and check-out dates are required." }, { status: 400 });
    }

    const target = await resolveReservationTarget({ orgSlug, storeSlug, propertyId });
    if (!target) {
      return NextResponse.json({ error: "Property not found." }, { status: 404 });
    }

    const result = await createStorefrontReservationRequest({
      target,
      guestName: body.guestName,
      guestEmail: body.guestEmail,
      guestPhone: body.guestPhone,
      startDate: body.startDate,
      endDate: body.endDate,
      adults: Number(body.adults ?? 1),
      children: Number(body.children ?? 0),
      guestNotes: body.guestNotes,
    });

    return NextResponse.json({
      ok: true,
      reservationId: result.reservationId,
      currency: result.currency,
      quote: result.quote,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Reservation request failed." },
      { status: 400 },
    );
  }
}
