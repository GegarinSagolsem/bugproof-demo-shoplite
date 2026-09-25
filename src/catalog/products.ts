export type Category = "Apparel" | "Electronics" | "Fitness" | "Home" | "Kitchen" | "Stationery";

export interface Product {
  id: string;
  name: string;
  category: Category;
  /** Pre-tax price in rupees. */
  price: number;
}

export const PRODUCTS: readonly Product[] = [
  { id: "p01", name: "Ceramic Coffee Mug", category: "Kitchen", price: 349 },
  { id: "p02", name: "Steel Water Bottle 1L", category: "Kitchen", price: 599 },
  { id: "p03", name: "Cast Iron Tawa", category: "Kitchen", price: 1049.25 },
  { id: "p04", name: "Bamboo Chopping Board", category: "Kitchen", price: 449.5 },
  { id: "p05", name: "Masala Dabba Spice Box", category: "Kitchen", price: 799 },
  { id: "p06", name: "Cotton Bath Towel", category: "Home", price: 399 },
  { id: "p07", name: "Handloom Cushion Cover", category: "Home", price: 299.75 },
  { id: "p08", name: "Brass Diya Set", category: "Home", price: 649 },
  { id: "p09", name: "Jute Storage Basket", category: "Home", price: 549 },
  { id: "p10", name: "Scented Soy Candle", category: "Home", price: 249.75 },
  { id: "p11", name: "Wireless Mouse", category: "Electronics", price: 899 },
  { id: "p12", name: "USB-C Charging Cable", category: "Electronics", price: 299 },
  { id: "p13", name: "Bluetooth Speaker", category: "Electronics", price: 2499 },
  { id: "p14", name: "Power Bank 10000mAh", category: "Electronics", price: 1299 },
  { id: "p15", name: "Noise-Cancelling Earbuds", category: "Electronics", price: 3999 },
  { id: "p16", name: "A5 Dotted Notebook", category: "Stationery", price: 199 },
  { id: "p17", name: "Gel Pen Pack", category: "Stationery", price: 149.25 },
  { id: "p18", name: "Desk Organizer", category: "Stationery", price: 699 },
  { id: "p19", name: "Yoga Mat", category: "Fitness", price: 1199 },
  { id: "p20", name: "Resistance Band Set", category: "Fitness", price: 749 },
  { id: "p21", name: "Steel Skipping Rope", category: "Fitness", price: 299 },
  { id: "p22", name: "Cotton Kurta", category: "Apparel", price: 1299.5 },
  { id: "p23", name: "Canvas Tote Bag", category: "Apparel", price: 349.75 },
  { id: "p24", name: "Linen Shirt", category: "Apparel", price: 1499 },
  { id: "p25", name: "Wool Pashmina Shawl", category: "Apparel", price: 2849 },
];

export function getProductById(id: string): Product | undefined {
  return PRODUCTS.find((product) => product.id === id);
}

export function listCategories(products: readonly Product[] = PRODUCTS): Category[] {
  return [...new Set(products.map((product) => product.category))].sort();
}
