"use client";

import { useEffect, useMemo, useState } from "react";
import { CalendarDays, Star } from "lucide-react";

interface BookingCardProps {
  orgSlug: string;
  storeSlug: string;
  propertyId: string;
  price: number | null;
  currency: string;
  period: string;
  rating: number | null;
  reviewCount: number | null;
}

interface QuoteResponse {
  available: boolean;
  currency: string;
  quote: {
    nights: number;
    nightlySubtotal: number;
    feesTotal: number;
    taxTotal: number;
    discountTotal: number;
    totalAmount: number;
  };
}

function dateInput(offsetDays: number) {
  const date = new Date();
  date.setDate(date.getDate() + offsetDays);
  return date.toISOString().slice(0, 10);
}

function money(value: number, currency: string) {
  return `${value.toLocaleString(undefined, {
    maximumFractionDigits: 2,
  })} ${currency}`;
}

export function BookingCard({
  orgSlug,
  storeSlug,
  propertyId,
  price,
  currency,
  period,
  rating,
  reviewCount,
}: BookingCardProps) {
  const [startDate, setStartDate] = useState(dateInput(1));
  const [endDate, setEndDate] = useState(dateInput(6));
  const [adults, setAdults] = useState("2");
  const [children, setChildren] = useState("0");
  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [guestPhone, setGuestPhone] = useState("");
  const [guestNotes, setGuestNotes] = useState("");
  const [quote, setQuote] = useState<QuoteResponse | null>(null);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const availabilityUrl = useMemo(() => {
    const params = new URLSearchParams({
      start: startDate,
      end: endDate,
      adults,
      children,
    });

    return `/api/storefront/${orgSlug}/store/${storeSlug}/property/${propertyId}/availability?${params.toString()}`;
  }, [adults, children, endDate, orgSlug, propertyId, startDate, storeSlug]);

  useEffect(() => {
    let cancelled = false;

    async function checkAvailability() {
      if (!startDate || !endDate) {
        return;
      }

      setIsChecking(true);
      setMessage(null);

      try {
        const response = await fetch(availabilityUrl);
        const body = (await response.json()) as QuoteResponse | { error?: string };

        if (!response.ok) {
          throw new Error("error" in body ? body.error : "Availability check failed.");
        }

        if (!cancelled) {
          setQuote(body as QuoteResponse);
        }
      } catch (error) {
        if (!cancelled) {
          setQuote(null);
          setMessage({
            type: "error",
            text: error instanceof Error ? error.message : "Availability check failed.",
          });
        }
      } finally {
        if (!cancelled) {
          setIsChecking(false);
        }
      }
    }

    const timeout = window.setTimeout(() => {
      void checkAvailability();
    }, 350);

    return () => {
      cancelled = true;
      window.clearTimeout(timeout);
    };
  }, [availabilityUrl, endDate, startDate]);

  async function handleSubmit() {
    if (!guestName.trim()) {
      setMessage({ type: "error", text: "Enter your name before requesting a booking." });
      return;
    }

    setIsSubmitting(true);
    setMessage(null);

    try {
      const response = await fetch(
        `/api/storefront/${orgSlug}/store/${storeSlug}/property/${propertyId}/reservation-request`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            guestName,
            guestEmail,
            guestPhone,
            startDate,
            endDate,
            adults: Number(adults) || 1,
            children: Number(children) || 0,
            guestNotes,
          }),
        },
      );
      const body = (await response.json()) as { error?: string };

      if (!response.ok) {
        throw new Error(body.error ?? "Request could not be submitted.");
      }

      setMessage({
        type: "success",
        text: "Request submitted. The listing team will confirm availability.",
      });
    } catch (error) {
      setMessage({
        type: "error",
        text: error instanceof Error ? error.message : "Request could not be submitted.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  const displayCurrency = quote?.currency ?? currency;

  return (
    <div className="border border-border-subtle bg-surface p-6 shadow-lg shadow-stone-200/40 sm:p-7 [border-radius:var(--storefront-radius-card)]">
      <div className="mb-6 flex items-end justify-between">
        <div>
          {price != null ? (
            <>
              <div className="flex items-baseline gap-1.5">
                <span className="text-3xl font-bold tracking-tight text-stone-900 tabular-nums">
                  {price.toLocaleString()}
                </span>
                <span className="text-base font-medium text-stone-500">{currency}</span>
              </div>
              <span className="text-sm text-stone-400">/{period}</span>
            </>
          ) : (
            <>
              <div className="text-2xl font-bold tracking-tight text-stone-900">
                Price on request
              </div>
              <span className="text-sm text-stone-400">
                Submit a request and the listing team will confirm pricing.
              </span>
            </>
          )}
        </div>
        {rating != null ? (
          <div className="flex items-center gap-1.5">
            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
            <span className="text-sm font-semibold text-stone-700">{rating.toFixed(1)}</span>
            <span className="text-sm text-stone-400">({reviewCount ?? 0})</span>
          </div>
        ) : (
          <div className="text-sm font-medium text-stone-400">New listing</div>
        )}
      </div>

      <div className="grid grid-cols-2 overflow-hidden rounded-xl border border-border-subtle">
        <label className="border-r border-border-subtle p-3.5">
          <span className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-stone-500">
            Check-in
          </span>
          <div className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4 text-stone-400" />
            <input
              type="date"
              value={startDate}
              onChange={(event) => setStartDate(event.target.value)}
              className="min-w-0 flex-1 bg-transparent text-sm font-medium text-stone-800 outline-none"
            />
          </div>
        </label>
        <label className="p-3.5">
          <span className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-stone-500">
            Check-out
          </span>
          <div className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4 text-stone-400" />
            <input
              type="date"
              value={endDate}
              onChange={(event) => setEndDate(event.target.value)}
              className="min-w-0 flex-1 bg-transparent text-sm font-medium text-stone-800 outline-none"
            />
          </div>
        </label>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-3">
        <label className="rounded-xl border border-border-subtle p-3.5">
          <span className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-stone-500">
            Adults
          </span>
          <input
            type="number"
            min="1"
            value={adults}
            onChange={(event) => setAdults(event.target.value)}
            className="w-full bg-transparent text-sm font-medium text-stone-800 outline-none"
          />
        </label>
        <label className="rounded-xl border border-border-subtle p-3.5">
          <span className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-stone-500">
            Children
          </span>
          <input
            type="number"
            min="0"
            value={children}
            onChange={(event) => setChildren(event.target.value)}
            className="w-full bg-transparent text-sm font-medium text-stone-800 outline-none"
          />
        </label>
      </div>

      <div className="mt-5 space-y-3">
        <input
          value={guestName}
          onChange={(event) => setGuestName(event.target.value)}
          placeholder="Your name"
          className="h-11 w-full rounded-xl border border-border-subtle px-3.5 text-sm outline-none focus:border-[var(--storefront-primary)]"
        />
        <input
          value={guestEmail}
          onChange={(event) => setGuestEmail(event.target.value)}
          placeholder="Email"
          className="h-11 w-full rounded-xl border border-border-subtle px-3.5 text-sm outline-none focus:border-[var(--storefront-primary)]"
        />
        <input
          value={guestPhone}
          onChange={(event) => setGuestPhone(event.target.value)}
          placeholder="Phone"
          className="h-11 w-full rounded-xl border border-border-subtle px-3.5 text-sm outline-none focus:border-[var(--storefront-primary)]"
        />
        <textarea
          value={guestNotes}
          onChange={(event) => setGuestNotes(event.target.value)}
          placeholder="Message or special requests"
          rows={3}
          className="w-full rounded-xl border border-border-subtle px-3.5 py-3 text-sm outline-none focus:border-[var(--storefront-primary)]"
        />
      </div>

      {message && (
        <div
          className={`mt-4 rounded-xl border px-4 py-3 text-sm ${
            message.type === "success"
              ? "border-emerald-200 bg-emerald-50 text-emerald-700"
              : "border-red-200 bg-red-50 text-red-700"
          }`}
        >
          {message.text}
        </div>
      )}

      <button
        className="mt-5 h-13 w-full text-base font-semibold text-[var(--storefront-primary-foreground)] transition-all [background:var(--storefront-primary-fill)] hover:[background:var(--storefront-primary-hover-fill)] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 [border-radius:var(--storefront-radius-button)]"
        disabled={isSubmitting || isChecking || quote?.available === false}
        onClick={() => void handleSubmit()}
      >
        {isSubmitting
          ? "Submitting..."
          : quote?.available === false
            ? "Dates unavailable"
            : "Request booking"}
      </button>

      <p className="mt-3 text-center text-sm text-stone-400">
        You will not be charged. The listing team will confirm your request.
      </p>

      {quote ? (
        <div className="mt-6 space-y-3 border-t border-border-subtle pt-5">
          <BreakdownRow
            label={`${price?.toLocaleString() ?? "Rate"} ${displayCurrency} x ${quote.quote.nights} nights`}
            value={money(quote.quote.nightlySubtotal, displayCurrency)}
          />
          <BreakdownRow label="Fees" value={money(quote.quote.feesTotal, displayCurrency)} />
          <BreakdownRow label="Taxes" value={money(quote.quote.taxTotal, displayCurrency)} />
          {quote.quote.discountTotal > 0 && (
            <BreakdownRow label="Discounts" value={`-${money(quote.quote.discountTotal, displayCurrency)}`} />
          )}
          <div className="flex justify-between border-t border-border-subtle pt-3">
            <span className="text-base font-bold text-stone-900">Estimated total</span>
            <span className="text-base font-bold text-stone-900 tabular-nums">
              {money(quote.quote.totalAmount, displayCurrency)}
            </span>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function BreakdownRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-stone-600 underline decoration-stone-300 underline-offset-2">
        {label}
      </span>
      <span className="font-medium tabular-nums text-stone-800">{value}</span>
    </div>
  );
}
