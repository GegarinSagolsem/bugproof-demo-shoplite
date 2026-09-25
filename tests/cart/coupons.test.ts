import { describe, expect, it } from "vitest";
import { addItem, createCart } from "../../src/cart/cart";
import { applyCoupon, InvalidCouponError, isKnownCoupon, removeCoupon } from "../../src/cart/coupons";
import { computeTotals } from "../../src/cart/totals";

// Bluetooth Speaker, ₹2,499.
const speakerCart = () => addItem(createCart("coupon"), "p13");

describe("coupons", () => {
  it("applies a percentage coupon to the subtotal", () => {
    expect(computeTotals(applyCoupon(speakerCart(), "SAVE10")).discount).toBe(249.9);
  });

  it("applies a flat coupon", () => {
    expect(computeTotals(applyCoupon(speakerCart(), "FLAT200")).discount).toBe(200);
  });

  it("accepts codes in any case with surrounding spaces", () => {
    expect(computeTotals(applyCoupon(speakerCart(), " save10 ")).discount).toBe(249.9);
  });

  it("rejects unknown coupon codes", () => {
    expect(() => applyCoupon(speakerCart(), "FREEBIE")).toThrow(InvalidCouponError);
  });

  it("removes an applied coupon", () => {
    expect(computeTotals(removeCoupon(applyCoupon(speakerCart(), "SAVE10"))).discount).toBe(0);
  });

  it("caps a flat coupon at the subtotal", () => {
    const cart = addItem(createCart("small"), "p16"); // ₹199
    expect(computeTotals(applyCoupon(cart, "FLAT200")).discount).toBe(199);
  });

  it("rounds percentage discounts to the nearest paisa", () => {
    const cart = addItem(createCart("candle"), "p10"); // ₹249.75 → 10% = ₹24.975
    expect(computeTotals(applyCoupon(cart, "SAVE10")).discount).toBe(24.98);
  });

  it("recognises every active campaign code", () => {
    for (const code of ["SAVE10", "WELCOME15", "FLAT200", "DIWALI60"]) {
      expect(isKnownCoupon(code)).toBe(true);
    }
    expect(isKnownCoupon("save10")).toBe(false);
  });

  it("takes the discount off the total after GST and shipping", () => {
    expect(computeTotals(applyCoupon(speakerCart(), "WELCOME15"))).toMatchObject({
      subtotal: 2499,
      discount: 374.85,
      tax: 449.82,
      shipping: 0,
      total: 2573.97,
    });
  });
});

describe("stacked coupons", () => {
  it("combines a percentage and a flat coupon", () => {
    const cart = applyCoupon(applyCoupon(speakerCart(), "SAVE10"), "FLAT200");
    expect(computeTotals(cart).discount).toBe(449.9);
  });

  it("keeps coupons in the order they were applied", () => {
    const cart = applyCoupon(applyCoupon(speakerCart(), "save10"), "flat200");
    expect(cart.couponCodes).toEqual(["SAVE10", "FLAT200"]);
  });
});
