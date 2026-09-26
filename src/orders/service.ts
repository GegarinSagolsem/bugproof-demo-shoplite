import type { Cart, CartItem } from "../cart/cart";
import { computeTotals, type CartTotals } from "../cart/totals";
import { estimateDelivery } from "../delivery/estimate";
import { FakePaymentGateway, type PaymentGateway } from "./payments";

export interface Order {
  id: string;
  cartId: string;
  items: CartItem[];
  totals: CartTotals;
  paymentId: string;
  /** ISO timestamp. */
  placedAt: string;
  /** YYYY-MM-DD in IST. */
  estimatedDelivery: string;
}

export class EmptyCartError extends Error {
  constructor() {
    super("Cannot place an order for an empty cart");
    this.name = "EmptyCartError";
  }
}

export class DuplicateOrderError extends Error {
  constructor(readonly cartId: string) {
    super(`Cart ${cartId} has already been ordered`);
    this.name = "DuplicateOrderError";
  }
}

export interface OrderServiceOptions {
  payments?: PaymentGateway;
  clock?: () => Date;
}

export class OrderService {
  private readonly orders: Order[] = [];
  private readonly pending = new Set<string>();
  private readonly payments: PaymentGateway;
  private readonly clock: () => Date;
  private seq = 0;

  constructor(options: OrderServiceOptions = {}) {
    this.payments = options.payments ?? new FakePaymentGateway();
    this.clock = options.clock ?? (() => new Date());
  }

  /** Places an order for the cart. A cart can only be ordered once. */
  async placeOrder(cart: Cart): Promise<Order> {
    if (cart.items.length === 0) throw new EmptyCartError();
    if (this.hasOrderFor(cart.id)) throw new DuplicateOrderError(cart.id);
    if (this.pending.has(cart.id)) throw new DuplicateOrderError(cart.id);
    this.pending.add(cart.id);
    const totals = computeTotals(cart);
    const placedAt = this.clock();
    let paymentId: string;
    try {
      ({ paymentId } = await this.payments.charge(totals.total, cart.id));
    } finally {
      this.pending.delete(cart.id);
    }
    const order: Order = {
      id: `ORD-${String(++this.seq).padStart(4, "0")}`,
      cartId: cart.id,
      items: cart.items.map((item) => ({ ...item })),
      totals,
      paymentId,
      placedAt: placedAt.toISOString(),
      estimatedDelivery: estimateDelivery(placedAt),
    };
    this.orders.push(order);
    return order;
  }

  /** All orders, newest first. */
  listOrders(): Order[] {
    return [...this.orders].sort((a, b) => b.placedAt.localeCompare(a.placedAt) || b.id.localeCompare(a.id));
  }

  getOrder(id: string): Order | undefined {
    return this.orders.find((order) => order.id === id);
  }

  private hasOrderFor(cartId: string): boolean {
    return this.orders.some((order) => order.cartId === cartId);
  }
}
