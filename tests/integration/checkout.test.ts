import { describe, expect, it } from "vitest";
import { addItem, createCart } from "../../src/cart/cart";
import { applyCoupon } from "../../src/cart/coupons";
import { computeTotals } from "../../src/cart/totals";
import { paginate } from "../../src/catalog/paginate";
import { PRODUCTS } from "../../src/catalog/products";
import { searchProducts } from "../../src/catalog/search";
import { formatINR } from "../../src/currency/format";
import { FakePaymentGateway } from "../../src/orders/payments";
import { OrderService } from "../../src/orders/service";

const TUESDAY_MORNING_IST = new Date("2026-03-10T10:00:00+05:30");

describe("checkout flow", () => {
  it("searches, adds to cart, applies a coupon and places an order", async () => {
    const [speaker] = searchProducts(PRODUCTS, "Speaker");
    const cart = applyCoupon(addItem(createCart("flow-1"), speaker.id), "SAVE10");
    const service = new OrderService({ payments: new FakePaymentGateway(), clock: () => TUESDAY_MORNING_IST });

    const order = await service.placeOrder(cart);

    expect(order.totals).toMatchObject({ subtotal: 2499, discount: 249.9, tax: 449.82, shipping: 0, total: 2698.92 });
    expect(service.listOrders()).toEqual([order]);
  });

  it("formats the order total for the receipt", async () => {
    const service = new OrderService({ clock: () => TUESDAY_MORNING_IST });
    const order = await service.placeOrder(applyCoupon(addItem(createCart("flow-2"), "p13"), "SAVE10"));
    expect(formatINR(order.totals.total)).toBe("₹2,698.92");
  });

  it("adds a product found on the second catalog page", () => {
    const page = paginate(PRODUCTS, 2, 6);
    expect(page.items.map((product) => product.id)).toEqual(["p07", "p08", "p09", "p10", "p11", "p12"]);
    const cart = addItem(createCart("flow-3"), page.items[4].id);
    expect(cart.items[0].name).toBe("Wireless Mouse");
  });

  it("drops shipping once the cart crosses ₹999", () => {
    const below = addItem(addItem(createCart("flow-4"), "p06"), "p02");
    expect(computeTotals(below)).toMatchObject({ subtotal: 998, shipping: 49 });
    expect(computeTotals(addItem(below, "p16"))).toMatchObject({ subtotal: 1197, shipping: 0 });
  });

  it("estimates next-week delivery for a Saturday morning order", async () => {
    const service = new OrderService({ clock: () => new Date("2026-03-14T10:00:00+05:30") });
    const order = await service.placeOrder(addItem(createCart("flow-5"), "p19"));
    expect(order.estimatedDelivery).toBe("2026-03-18");
  });
});
