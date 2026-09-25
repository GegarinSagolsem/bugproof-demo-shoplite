import { describe, expect, it } from "vitest";
import { getProductById, listCategories, PRODUCTS } from "../../src/catalog/products";

describe("product catalog", () => {
  it("ships with 25 products", () => {
    expect(PRODUCTS).toHaveLength(25);
  });

  it("uses unique product ids", () => {
    expect(new Set(PRODUCTS.map((product) => product.id)).size).toBe(PRODUCTS.length);
  });

  it("prices every product in rupees with at most two decimals", () => {
    for (const product of PRODUCTS) {
      expect(product.price).toBeGreaterThan(0);
      expect(Math.round(product.price * 100) / 100).toBe(product.price);
    }
  });

  it("looks up products by id", () => {
    expect(getProductById("p01")?.name).toBe("Ceramic Coffee Mug");
    expect(getProductById("nope")).toBeUndefined();
  });

  it("lists categories alphabetically", () => {
    expect(listCategories()).toEqual(["Apparel", "Electronics", "Fitness", "Home", "Kitchen", "Stationery"]);
  });
});
