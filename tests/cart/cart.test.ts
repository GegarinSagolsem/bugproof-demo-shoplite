import { describe, expect, it } from "vitest";
import {
  addItem,
  createCart,
  InvalidQuantityError,
  itemCount,
  removeItem,
  setQuantity,
  UnknownProductError,
} from "../../src/cart/cart";

describe("cart", () => {
  it("starts empty", () => {
    const cart = createCart("c1");
    expect(cart.items).toEqual([]);
    expect(itemCount(cart)).toBe(0);
  });

  it("adds a product with a snapshot of its name and price", () => {
    const cart = addItem(createCart("c1"), "p01");
    expect(cart.items).toEqual([{ productId: "p01", name: "Ceramic Coffee Mug", unitPrice: 349, quantity: 1 }]);
  });

  it("adds several units at once", () => {
    expect(addItem(createCart("c1"), "p16", 3).items[0].quantity).toBe(3);
  });

  it("increments the quantity when the same product is added again", () => {
    const cart = addItem(addItem(createCart("c1"), "p01"), "p01", 2);
    expect(cart.items).toHaveLength(1);
    expect(cart.items[0].quantity).toBe(3);
  });

  it("rejects unknown products", () => {
    expect(() => addItem(createCart("c1"), "p99")).toThrow(UnknownProductError);
  });

  it("rejects a quantity that is not a number", () => {
    expect(() => addItem(createCart("c1"), "p01", Number.NaN)).toThrow(InvalidQuantityError);
  });

  it("updates the quantity of a line", () => {
    const cart = setQuantity(addItem(createCart("c1"), "p01"), "p01", 4);
    expect(cart.items[0].quantity).toBe(4);
  });

  it("removes a line when its quantity is set to zero", () => {
    const cart = setQuantity(addItem(createCart("c1"), "p01"), "p01", 0);
    expect(cart.items).toEqual([]);
  });

  it("removes a line", () => {
    const cart = removeItem(addItem(addItem(createCart("c1"), "p01"), "p02"), "p01");
    expect(cart.items.map((item) => item.productId)).toEqual(["p02"]);
  });

  it("does not mutate the original cart", () => {
    const original = createCart("c1");
    const updated = addItem(original, "p01", 2);
    expect(original.items).toEqual([]);
    expect(itemCount(updated)).toBe(2);
  });
});
