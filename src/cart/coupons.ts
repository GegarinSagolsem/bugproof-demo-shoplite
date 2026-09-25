import { fromPaise, toPaise } from "../currency/money";
import type { Cart } from "./cart";

/**
 * Active campaign coupons, in the format marketing uses in the promo sheet:
 * "10%" is a percentage off the subtotal, "200" is a flat amount in rupees.
 */
export const COUPON_RULES: Readonly<Record<string, string>> = {
  SAVE10: "10%",
  WELCOME15: "15%",
  FLAT200: "200",
  DIWALI60: "60%",
};

export class InvalidCouponError extends Error {
  constructor(readonly code: string) {
    super(`Coupon "${code}" is not valid`);
    this.name = "InvalidCouponError";
  }
}

export function normalizeCouponCode(input: string): string {
  return input.trim().toUpperCase();
}

export function isKnownCoupon(code: string): boolean {
  return Object.hasOwn(COUPON_RULES, code);
}

/** Discount in rupees for a coupon code against a pre-tax subtotal. */
export function couponDiscount(subtotal: number, code?: string): number {
  if (!code) return 0;
  const rule = COUPON_RULES[code];
  const value = parseFloat(rule);
  if (rule.endsWith("%")) return fromPaise(Math.round((toPaise(subtotal) * value) / 100));
  return Math.min(value, subtotal);
}

export function applyCoupon(cart: Cart, input: string): Cart {
  const code = normalizeCouponCode(input);
  if (code && !isKnownCoupon(code)) throw new InvalidCouponError(input.trim());
  return { ...cart, couponCode: code };
}

export function removeCoupon(cart: Cart): Cart {
  return { ...cart, couponCode: undefined };
}
