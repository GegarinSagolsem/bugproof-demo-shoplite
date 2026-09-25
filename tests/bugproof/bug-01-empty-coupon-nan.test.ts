// BugProof repro: bug-01 — Applying an empty coupon code produces ₹NaN for Discount and Total
import { describe, it, expect } from "vitest";
import { addItem, createCart } from "../../src/cart/cart";
import { applyCoupon } from "../../src/cart/coupons";
import { computeTotals } from "../../src/cart/totals";

describe("applyCoupon with empty string", () => {
  it("discount is 0 (not NaN) when an empty coupon code is applied", () => {
    // Reproduce: user clicks Apply with an empty input field
    const cart = addItem(createCart("session-empty-coupon"), "p13");
    const updated = applyCoupon(cart, "");
    const totals = computeTotals(updated);

    // Bug: discount is NaN because COUPON_RULES[""] is undefined → parseCouponRule(undefined) → parseFloat(undefined) → NaN
    expect(totals.discount).toBe(0);
  });

  it("total is a finite number (not NaN) when an empty coupon code is applied", () => {
    const cart = addItem(createCart("session-empty-coupon-2"), "p13");
    const updated = applyCoupon(cart, "");
    const totals = computeTotals(updated);

    expect(Number.isFinite(totals.total)).toBe(true);
  });
});
