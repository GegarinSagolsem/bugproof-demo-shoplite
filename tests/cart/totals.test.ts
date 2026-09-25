import { describe, expect, it } from "vitest";
import { addItem, createCart } from "../../src/cart/cart";
import { computeTotals } from "../../src/cart/totals";

const cartWith = (...lines: Array<[string, number]>) =>
  lines.reduce((cart, [productId, quantity]) => addItem(cart, productId, quantity), createCart("totals"));

describe("computeTotals", () => {
  it("is all zeros for an empty cart", () => {
    expect(computeTotals(createCart("empty"))).toMatchObject({ itemCount: 0, subtotal: 0, tax: 0, shipping: 0, total: 0 });
  });

  it("adds 18% GST to the subtotal", () => {
    const totals = computeTotals(cartWith(["p01", 1]));
    expect(totals.subtotal).toBe(349);
    expect(totals.tax).toBe(62.82);
  });

  it("charges shipping below the free-shipping threshold", () => {
    expect(computeTotals(cartWith(["p16", 1])).shipping).toBe(49);
  });

  it("ships free at or above ₹999", () => {
    expect(computeTotals(cartWith(["p13", 1])).shipping).toBe(0);
  });

  it("computes the grand total", () => {
    expect(computeTotals(cartWith(["p02", 2]))).toMatchObject({
      subtotal: 1198,
      tax: 215.64,
      shipping: 0,
      total: 1413.64,
    });
  });

  it("totals several lines", () => {
    expect(computeTotals(cartWith(["p01", 2], ["p12", 1], ["p16", 3]))).toMatchObject({
      itemCount: 6,
      subtotal: 1594,
      tax: 286.92,
      total: 1880.92,
    });
  });
});
