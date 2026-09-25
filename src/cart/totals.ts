import { fromPaise, toPaise } from "../currency/money";
import { calculateGst } from "../tax/gst";
import type { Cart } from "./cart";
import { couponDiscount } from "./coupons";

export const FREE_SHIPPING_THRESHOLD = 999;
export const SHIPPING_FEE = 49;

export interface CartTotals {
  itemCount: number;
  subtotal: number;
  discount: number;
  tax: number;
  shipping: number;
  total: number;
}

export function shippingFor(subtotal: number, lineCount: number): number {
  if (lineCount === 0) return 0;
  return subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
}

export function computeTotals(cart: Cart): CartTotals {
  const subtotal = fromPaise(cart.items.reduce((sum, item) => sum + toPaise(item.unitPrice) * item.quantity, 0));
  const tax = calculateGst(subtotal);

  // Coupons come off the pre-tax subtotal; GST is charged on the list price.
  const discount = Math.min(couponDiscount(subtotal, cart.couponCode), subtotal);

  const shipping = shippingFor(subtotal, cart.items.length);
  const total = fromPaise(toPaise(subtotal) - toPaise(discount) + toPaise(tax) + toPaise(shipping));
  const itemCount = cart.items.reduce((sum, item) => sum + item.quantity, 0);
  return { itemCount, subtotal, discount, tax, shipping, total };
}
