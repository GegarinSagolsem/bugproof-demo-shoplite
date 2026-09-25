import type { Product } from "./products";

/** Case-insensitive substring search over product name and category. */
export function searchProducts(products: readonly Product[], query: string): Product[] {
  const needle = query.trim().toLowerCase();
  if (needle === "") return [...products];
  return products.filter(
    (product) =>
      product.name.toLowerCase().includes(needle) || product.category.toLowerCase().includes(needle),
  );
}
