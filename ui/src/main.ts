import { addItem, createCart, type Cart } from "../../src/cart/cart";
import { formatINR } from "../../src/currency/format";
import { FakePaymentGateway } from "../../src/orders/payments";
import { OrderService } from "../../src/orders/service";
import { bindCouponForm, renderCart } from "./cartView";
import { renderCatalog } from "./catalogView";
import { $ } from "./dom";
import { renderOrders } from "./ordersView";

// Simulated payment latency so the "Placing order…" state is visible.
const orders = new OrderService({ payments: new FakePaymentGateway(800) });

let cart: Cart = createCart();
let query = "";
let page = 1;

function setCart(next: Cart): void {
  cart = next;
  render();
}

function render(): void {
  renderCatalog({
    query,
    page,
    onPage: (next) => {
      page = next;
      render();
    },
    onAdd: (productId) => setCart(addItem(cart, productId)),
  });
  renderCart({ cart, onChange: setCart });
  renderOrders(orders.listOrders());
}

const search = $<HTMLInputElement>("#search");
search.addEventListener("input", () => {
  query = search.value;
  page = 1;
  render();
});

bindCouponForm(() => cart, setCart);

const placeButton = $<HTMLButtonElement>("#place-order");
const orderStatus = $("#order-status");
placeButton.addEventListener("click", async () => {
  if (cart.items.length === 0) {
    orderStatus.textContent = "Your cart is empty.";
    return;
  }
  placeButton.textContent = "Placing order…";
  try {
    const order = await orders.placeOrder(cart);
    cart = createCart();
    orderStatus.textContent = `Order ${order.id} placed · ${formatINR(order.totals.total)}`;
  } catch (error) {
    orderStatus.textContent = error instanceof Error ? error.message : String(error);
  } finally {
    placeButton.textContent = "Place order";
    render();
  }
});

render();
