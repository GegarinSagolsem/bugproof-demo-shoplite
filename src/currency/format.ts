const inr = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" });

/** Formats rupees for display, e.g. 123456.5 → "₹1,23,456.50". */
export function formatINR(amount: number): string {
  return inr.format(amount);
}

/** Formats a discount as a negative amount, e.g. 200 → "−₹200.00". */
export function formatDiscount(amount: number): string {
  return amount === 0 ? formatINR(0) : `−${formatINR(amount)}`;
}
