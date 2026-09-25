import { describe, expect, it } from "vitest";
import { fromPaise, roundMoney, toPaise } from "../../src/currency/money";

describe("money helpers", () => {
  it("converts rupees to integer paise", () => {
    expect(toPaise(19.99)).toBe(1999);
    expect(toPaise(1049.25)).toBe(104925);
  });

  it("converts paise back to rupees", () => {
    expect(fromPaise(12345)).toBe(123.45);
  });

  it("round-trips common prices without drift", () => {
    for (const price of [0.1, 0.2, 0.3, 349, 599.99, 2849]) {
      expect(fromPaise(toPaise(price))).toBe(price);
    }
  });

  it("rounds to the nearest paisa", () => {
    expect(roundMoney(10.004)).toBe(10);
    expect(roundMoney(10.006)).toBe(10.01);
  });
});
