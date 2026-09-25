import { addItem, createCart, type Cart } from "../../src/cart/cart";
import { bindCouponForm, renderCart } from "./cartView";
import { renderCatalog } from "./catalogView";
import { $ } from "./dom";

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
}

const search = $<HTMLInputElement>("#search");
search.addEventListener("input", () => {
  query = search.value;
  page = 1;
  render();
});

bindCouponForm(() => cart, setCart);

render();
