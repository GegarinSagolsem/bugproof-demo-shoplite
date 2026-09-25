import { describe, expect, it } from "vitest";
import { addItem, createCart } from "../../src/cart/cart";
import { computeTotals } from "../../src/cart/totals";
import { FakePaymentGateway } from "../../src/orders/payments";
import { DuplicateOrderError, EmptyCartError, OrderService } from "../../src/orders/service";

const MORNING_IST = new Date("2026-03-10T10:00:00+05:30");

function setup() {
  const payments = new FakePaymentGateway();
  const service = new OrderService({ payments, clock: () => MORNING_IST });
  return { payments, service };
}

const cartFor = (id: string) => addItem(addItem(createCart(id), "p01", 2), "p12");

describe("OrderService", () => {
  it("places an order with the cart's items and totals", async () => {
    const { service } = setup();
    const order = await service.placeOrder(cartFor("o1"));
    expect(order.totals).toEqual(computeTotals(cartFor("o1")));
    expect(order.items.map((item) => item.productId)).toEqual(["p01", "p12"]);
  });

  it("numbers orders sequentially", async () => {
    const { service } = setup();
    const first = await service.placeOrder(cartFor("o1"));
    const second = await service.placeOrder(cartFor("o2"));
    expect([first.id, second.id]).toEqual(["ORD-0001", "ORD-0002"]);
  });

  it("rejects an empty cart", async () => {
    const { service } = setup();
    await expect(service.placeOrder(createCart("empty"))).rejects.toThrow(EmptyCartError);
  });

  it("refuses to order the same cart twice", async () => {
    const { service } = setup();
    const cart = cartFor("o1");
    await service.placeOrder(cart);
    await expect(service.placeOrder(cart)).rejects.toThrow(DuplicateOrderError);
  });

  it("charges the payment gateway for the order total", async () => {
    const { payments, service } = setup();
    const order = await service.placeOrder(cartFor("o1"));
    expect(payments.charges).toEqual([{ amount: order.totals.total, reference: "o1" }]);
  });

  it("records when the order was placed", async () => {
    const { service } = setup();
    expect((await service.placeOrder(cartFor("o1"))).placedAt).toBe(MORNING_IST.toISOString());
  });

  it("estimates delivery from the order time", async () => {
    const { service } = setup();
    expect((await service.placeOrder(cartFor("o1"))).estimatedDelivery).toBe("2026-03-13");
  });
});
