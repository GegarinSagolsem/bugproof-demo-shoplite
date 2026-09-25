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
});
