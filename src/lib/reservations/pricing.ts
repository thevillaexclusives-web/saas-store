export type FeeKind =
  | "cleaning"
  | "service"
  | "tax"
  | "security_deposit"
  | "extra_guest"
  | "discount"
  | "misc";

export type FeeCalculationType = "flat" | "per_night" | "percentage";

export interface QuoteFeeInput {
  kind: FeeKind;
  label: string;
  calculationType: FeeCalculationType;
  quantity?: number;
  rate?: number;
}

export interface ReservationQuoteInput {
  startDate: string;
  endDate: string;
  nightlyRate: number;
  minimumNights?: number;
  fees?: QuoteFeeInput[];
}

const MS_PER_DAY = 24 * 60 * 60 * 1000;

function parseDateOnly(value: string) {
  const [year, month, day] = value.split("-").map(Number);
  if (!year || !month || !day) {
    return null;
  }

  return Date.UTC(year, month - 1, day);
}

function roundMoney(value: number) {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

export function calculateNights(startDate: string, endDate: string) {
  const start = parseDateOnly(startDate);
  const end = parseDateOnly(endDate);
  if (start == null || end == null || end <= start) {
    return 0;
  }

  return Math.round((end - start) / MS_PER_DAY);
}

export function calculateReservationQuote(input: ReservationQuoteInput) {
  const nights = calculateNights(input.startDate, input.endDate);
  const minimumNights = input.minimumNights ?? 1;

  if (nights <= 0) {
    throw new Error("Check-out date must be after check-in date.");
  }

  if (nights < minimumNights) {
    throw new Error(`Minimum stay is ${minimumNights} night${minimumNights === 1 ? "" : "s"}.`);
  }

  const nightlySubtotal = roundMoney(Math.max(0, input.nightlyRate) * nights);
  const fees = (input.fees ?? [])
    .filter((fee) => fee.label.trim() && (fee.rate ?? 0) !== 0)
    .map((fee, index) => {
      const quantity = fee.quantity ?? 1;
      const rate = fee.rate ?? 0;
      const amount =
        fee.calculationType === "per_night"
          ? roundMoney(rate * nights)
          : fee.calculationType === "percentage"
            ? roundMoney(nightlySubtotal * (rate / 100))
            : roundMoney(rate * quantity);

      return {
        kind: fee.kind,
        label: fee.label.trim(),
        calculation_type: fee.calculationType,
        quantity,
        rate,
        amount,
        taxable: false,
        sort_order: index,
      };
    });
  const taxTotal = roundMoney(
    fees.filter((fee) => fee.kind === "tax").reduce((sum, fee) => sum + fee.amount, 0),
  );
  const discountTotal = roundMoney(
    Math.abs(
      fees
        .filter((fee) => fee.kind === "discount")
        .reduce((sum, fee) => sum + fee.amount, 0),
    ),
  );
  const feesTotal = roundMoney(
    fees
      .filter((fee) => fee.kind !== "tax" && fee.kind !== "discount")
      .reduce((sum, fee) => sum + fee.amount, 0),
  );

  return {
    nights,
    nightlySubtotal,
    fees,
    feesTotal,
    discountTotal,
    taxTotal,
    totalAmount: Math.max(0, roundMoney(nightlySubtotal + feesTotal + taxTotal - discountTotal)),
  };
}
