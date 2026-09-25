import { fromPaise, toPaise } from "../currency/money";

/** Standard GST slab applied to everything in the catalog. */
export const GST_RATE_PERCENT = 18;
export const GST_RATE = GST_RATE_PERCENT / 100;

/**
 * GST on a pre-tax amount, rounded half-up to the nearest paisa. Computed in integer paise
 * so that amounts like ₹249.75 (→ ₹44.955) round the same way every time.
 */
export function calculateGst(amount: number, ratePercent: number = GST_RATE_PERCENT): number {
  if (ratePercent < 0) throw new RangeError(`GST rate cannot be negative: ${ratePercent}`);
  return fromPaise(Math.round((toPaise(amount) * ratePercent) / 100));
}
