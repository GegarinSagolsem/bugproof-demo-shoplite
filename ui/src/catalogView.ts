import { paginate } from "../../src/catalog/paginate";
import { PRODUCTS, type Product } from "../../src/catalog/products";
import { searchProducts } from "../../src/catalog/search";
import { formatINR } from "../../src/currency/format";
import { $, el } from "./dom";

export const PAGE_SIZE = 6;

export interface CatalogProps {
  query: string;
  page: number;
  onPage(page: number): void;
}

function initials(name: string): string {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();
}

function productCard(product: Product): HTMLElement {
  return el(
    "article",
    { className: "card" },
    el("div", { className: `thumb thumb-${product.category.toLowerCase()}` }, initials(product.name)),
    el("h3", {}, product.name),
    el("p", { className: "category" }, product.category),
    el("p", { className: "price" }, formatINR(product.price)),
  );
}

export function renderCatalog({ query, page, onPage }: CatalogProps): void {
  const results = searchProducts(PRODUCTS, query);
  const current = paginate(results, page, PAGE_SIZE);

  const grid = $("#product-grid");
  if (results.length === 0) {
    grid.replaceChildren(el("p", { className: "empty" }, `No products match “${query.trim()}”.`));
  } else {
    grid.replaceChildren(...current.items.map(productCard));
  }

  const first = current.totalItems === 0 ? 0 : (current.page - 1) * current.pageSize + 1;
  const last = current.totalItems === 0 ? 0 : first + current.items.length - 1;
  $("#pager").replaceChildren(
    el("button", { type: "button", disabled: !current.hasPrev, onclick: () => onPage(current.page - 1) }, "‹ Prev"),
    el(
      "span",
      { className: "pager-info" },
      `Page ${current.page} of ${current.totalPages} · Showing ${first}–${last} of ${current.totalItems}`,
    ),
    el("button", { type: "button", disabled: !current.hasNext, onclick: () => onPage(current.page + 1) }, "Next ›"),
  );
}
