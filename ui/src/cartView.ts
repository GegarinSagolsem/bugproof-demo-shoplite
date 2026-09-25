import { InvalidQuantityError, removeItem, setQuantity, type Cart } from "../../src/cart/cart";
import { applyCoupon, InvalidCouponError, removeCoupon } from "../../src/cart/coupons";
import { lineItems, type LineItem } from "../../src/cart/lineItems";
import { computeTotals } from "../../src/cart/totals";
import { formatDiscount, formatINR } from "../../src/currency/format";
import { estimateDelivery, formatDeliveryDate } from "../../src/delivery/estimate";
import { GST_RATE_PERCENT } from "../../src/tax/gst";
import { $, el } from "./dom";

export interface CartViewProps {
  cart: Cart;
  onChange(cart: Cart): void;
}

let couponError = "";

export function bindCouponForm(getCart: () => Cart, onChange: (cart: Cart) => void): void {
  const form = $<HTMLFormElement>("#coupon-form");
  const input = $<HTMLInputElement>("#coupon-input");
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    try {
      couponError = "";
      onChange(applyCoupon(getCart(), input.value));
      input.value = "";
    } catch (error) {
      if (!(error instanceof InvalidCouponError)) throw error;
      couponError = error.message;
      onChange(getCart());
    }
  });
}

function lineRow(line: LineItem, cart: Cart, onChange: (cart: Cart) => void): HTMLElement {
  const qty = el("input", { type: "number", min: "1", value: String(line.quantity), className: "qty" });
  qty.addEventListener("change", () => {
    try {
      onChange(setQuantity(cart, line.productId, Number(qty.value)));
    } catch (error) {
      if (!(error instanceof InvalidQuantityError)) throw error;
      qty.value = String(line.quantity);
    }
  });
  return el(
    "li",
    { className: "line" },
    el("div", { className: "line-name" }, line.name, el("small", {}, `${formatINR(line.unitPrice)} each`)),
    qty,
    el("span", { className: "line-total" }, formatINR(line.lineTotal)),
    el(
      "button",
      { type: "button", className: "remove", title: "Remove", onclick: () => onChange(removeItem(cart, line.productId)) },
      "×",
    ),
  );
}

function row(label: string, value: string, className = ""): HTMLElement[] {
  return [el("dt", { className }, label), el("dd", { className }, value)];
}

export function renderCart({ cart, onChange }: CartViewProps): void {
  const lines = lineItems(cart);
  $("#cart-lines").replaceChildren(
    ...(lines.length === 0
      ? [el("li", { className: "empty" }, "Your cart is empty.")]
      : lines.map((line) => lineRow(line, cart, onChange))),
  );

  const totals = computeTotals(cart);
  $("#totals").replaceChildren(
    ...row(`Subtotal (${totals.itemCount} items)`, formatINR(totals.subtotal)),
    ...(totals.discount !== 0 ? row("Discount", formatDiscount(totals.discount), "discount") : []),
    ...row(`GST (${GST_RATE_PERCENT}%)`, formatINR(totals.tax)),
    ...row("Shipping", totals.shipping === 0 ? "Free" : formatINR(totals.shipping)),
    ...row("Total", formatINR(totals.total), "grand"),
  );

  $("#delivery").textContent =
    lines.length === 0
      ? ""
      : `Estimated delivery: ${formatDeliveryDate(estimateDelivery(new Date()))}. Orders after 8 PM IST ship the next day.`;

  const status = $("#coupon-status");
  if (couponError) {
    status.replaceChildren(el("span", { className: "error" }, couponError));
  } else if (cart.couponCode) {
    status.replaceChildren(
      el("span", { className: "applied" }, `Coupon ${cart.couponCode} applied`),
      el("button", { type: "button", className: "link", onclick: () => onChange(removeCoupon(cart)) }, "Remove"),
    );
  } else {
    status.replaceChildren();
  }
}
