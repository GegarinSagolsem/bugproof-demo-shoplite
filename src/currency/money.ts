/**
 * Amounts are passed around in rupees, but arithmetic that must be exact is done in
 * integer paise (1 rupee = 100 paise).
 */
export function toPaise(rupees: number): number {
  return Math.round(rupees * 100);
}

export function fromPaise(paise: number): number {
  return paise / 100;
}

/** Rounds a rupee amount to the nearest paisa. */
export function roundMoney(amount: number): number {
  return Math.round(amount * 100) / 100;
}
