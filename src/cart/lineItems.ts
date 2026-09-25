import { roundMoney } from "../currency/money";
import type { Cart, CartItem } from "./cart";

export interface LineItem extends CartItem {
  /** unitPrice × quantity, in rupees. */
  lineTotal: number;
}

export function lineItems(cart: Cart): LineItem[] {
  return cart.items.map((item) => ({ ...item, lineTotal: roundMoney(item.unitPrice * item.quantity) }));
}

export function sumBy<T>(items: readonly T[], pick: (item: T) => number): number {
  return items.reduce((sum, item) => sum + pick(item), 0);
}
