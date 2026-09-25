import { formatINR } from "../../src/currency/format";
import { DELIVERY_TIME_ZONE, formatDeliveryDate } from "../../src/delivery/estimate";
import type { Order } from "../../src/orders/service";
import { $, el } from "./dom";

const placedAtFormat = new Intl.DateTimeFormat("en-IN", {
  timeZone: DELIVERY_TIME_ZONE,
  day: "numeric",
  month: "short",
  hour: "numeric",
  minute: "2-digit",
});

function orderRow(order: Order): HTMLElement {
  return el(
    "li",
    { className: "order" },
    el("div", { className: "order-head" }, el("strong", {}, order.id), el("span", {}, formatINR(order.totals.total))),
    el(
      "div",
      { className: "order-meta" },
      `${order.totals.itemCount} items · placed ${placedAtFormat.format(new Date(order.placedAt))} IST · ` +
        `arrives ${formatDeliveryDate(order.estimatedDelivery)} · payment ${order.paymentId}`,
    ),
    el("div", { className: "order-items" }, order.items.map((item) => `${item.quantity} × ${item.name}`).join(", ")),
  );
}

export function renderOrders(orders: Order[]): void {
  $("#order-list").replaceChildren(
    ...(orders.length === 0 ? [el("li", { className: "empty" }, "No orders yet.")] : orders.map(orderRow)),
  );
}
