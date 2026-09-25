import { describe, expect, it } from "vitest";
import { PRODUCTS, type Product } from "../../src/catalog/products";
import { searchProducts } from "../../src/catalog/search";

const ids = (products: Product[]) => products.map((product) => product.id);

describe("searchProducts", () => {
  it("returns every product for an empty query", () => {
    expect(searchProducts(PRODUCTS, "")).toHaveLength(25);
  });

  it("treats a whitespace-only query as empty", () => {
    expect(searchProducts(PRODUCTS, "   ")).toHaveLength(25);
  });

  it("finds products by part of their name", () => {
    expect(ids(searchProducts(PRODUCTS, "Mug"))).toEqual(["p01"]);
  });

  it("finds products by category", () => {
    expect(searchProducts(PRODUCTS, "Kitchen")).toHaveLength(5);
  });

  it("ignores surrounding whitespace in the query", () => {
    expect(ids(searchProducts(PRODUCTS, "  Tawa "))).toEqual(["p03"]);
  });

  it("returns an empty list when nothing matches", () => {
    expect(searchProducts(PRODUCTS, "Laptop")).toEqual([]);
  });
});
