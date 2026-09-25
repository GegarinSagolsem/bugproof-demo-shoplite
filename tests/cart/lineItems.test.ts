import { describe, expect, it } from "vitest";
import { addItem, createCart } from "../../src/cart/cart";
import { lineItems, sumBy } from "../../src/cart/lineItems";

describe("lineItems", () => {
  it("computes a line total for every cart line", () => {
    const cart = addItem(addItem(createCart("lines"), "p01", 2), "p17", 3);
    expect(lineItems(cart).map((line) => line.lineTotal)).toEqual([698, 447.75]);
  });

  it("is empty for an empty cart", () => {
    expect(lineItems(createCart("lines"))).toEqual([]);
  });
});

describe("sumBy", () => {
  it("sums a numeric field", () => {
    expect(sumBy([{ n: 1 }, { n: 2 }, { n: 3 }], (item) => item.n)).toBe(6);
  });
});
