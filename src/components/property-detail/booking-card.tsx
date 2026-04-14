"use client";

import { CalendarDays, ChevronDown, Star } from "lucide-react";

interface BookingCardProps {
  price: number | null;
  currency: string;
  period: string;
  rating: number | null;
  reviewCount: number | null;
}

export function BookingCard({
  price,
  currency,
  period,
  rating,
  reviewCount,
}: BookingCardProps) {
  const nights = 5;
  const nightlyPrice = price ?? 0;
  const subtotal = nightlyPrice * nights;
  const cleaningFee = Math.round(nightlyPrice * 0.15);
  const serviceFee = Math.round(subtotal * 0.08);
  const total = subtotal + cleaningFee + serviceFee;

  return (
    <div className="bg-surface rounded-2xl border border-border-subtle shadow-lg shadow-stone-200/40 p-6 sm:p-7">
      {/* Price header */}
      <div className="flex items-end justify-between mb-6">
        <div>
          {price != null ? (
            <>
              <div className="flex items-baseline gap-1.5">
                <span className="text-3xl font-bold text-stone-900 tabular-nums tracking-tight">
                  {price.toLocaleString()}
                </span>
                <span className="text-base font-medium text-stone-500">
                  {currency}
                </span>
              </div>
              <span className="text-sm text-stone-400">/{period}</span>
            </>
          ) : (
            <>
              <div className="text-2xl font-bold tracking-tight text-stone-900">
                Price on request
              </div>
              <span className="text-sm text-stone-400">
                Contact the listing team for pricing.
              </span>
            </>
          )}
        </div>
        {rating != null ? (
          <div className="flex items-center gap-1.5">
            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
            <span className="text-sm font-semibold text-stone-700">
              {rating.toFixed(1)}
            </span>
            <span className="text-sm text-stone-400">
              ({reviewCount ?? 0})
            </span>
          </div>
        ) : (
          <div className="text-sm font-medium text-stone-400">New listing</div>
        )}
      </div>

      {/* Date inputs */}
      <div className="grid grid-cols-2 border border-border-subtle rounded-xl overflow-hidden mb-3">
        <div className="p-3.5 border-r border-border-subtle hover:bg-stone-50 transition-colors cursor-pointer">
          <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-500 mb-1">
            Check-in
          </label>
          <div className="flex items-center gap-2">
            <CalendarDays className="w-4 h-4 text-stone-400" />
            <span className="text-sm text-stone-800 font-medium">
              Mar 15, 2026
            </span>
          </div>
        </div>
        <div className="p-3.5 hover:bg-stone-50 transition-colors cursor-pointer">
          <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-500 mb-1">
            Check-out
          </label>
          <div className="flex items-center gap-2">
            <CalendarDays className="w-4 h-4 text-stone-400" />
            <span className="text-sm text-stone-800 font-medium">
              Mar 20, 2026
            </span>
          </div>
        </div>
      </div>

      {/* Guest selector */}
      <button className="w-full flex items-center justify-between p-3.5 border border-border-subtle rounded-xl mb-5 hover:bg-stone-50 transition-colors">
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-500 mb-1">
            Guests
          </label>
          <span className="text-sm text-stone-800 font-medium">2 guests</span>
        </div>
        <ChevronDown className="w-4 h-4 text-stone-400" />
      </button>

      {/* Reserve button */}
      <button className="w-full h-13 rounded-xl bg-[var(--storefront-primary)] text-[var(--storefront-primary-foreground)] font-semibold text-base hover:bg-[var(--storefront-primary-hover)] active:scale-[0.98] transition-all">
        {price != null ? "Reserve" : "Request availability"}
      </button>

      <p className="text-center text-sm text-stone-400 mt-3">
        {price != null ? "You won&apos;t be charged yet" : "Pricing is confirmed offline"}
      </p>

      {/* Price breakdown */}
      {price != null ? (
        <div className="mt-6 pt-5 border-t border-border-subtle space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-stone-600 underline underline-offset-2 decoration-stone-300 cursor-help">
              {price.toLocaleString()} {currency} x {nights} nights
            </span>
            <span className="text-stone-800 font-medium tabular-nums">
              {subtotal.toLocaleString()} {currency}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-stone-600 underline underline-offset-2 decoration-stone-300 cursor-help">
              Cleaning fee
            </span>
            <span className="text-stone-800 font-medium tabular-nums">
              {cleaningFee.toLocaleString()} {currency}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-stone-600 underline underline-offset-2 decoration-stone-300 cursor-help">
              Service fee
            </span>
            <span className="text-stone-800 font-medium tabular-nums">
              {serviceFee.toLocaleString()} {currency}
            </span>
          </div>
          <div className="flex justify-between pt-3 border-t border-border-subtle">
            <span className="text-base font-bold text-stone-900">Total</span>
            <span className="text-base font-bold text-stone-900 tabular-nums">
              {total.toLocaleString()} {currency}
            </span>
          </div>
        </div>
      ) : null}
    </div>
  );
}
