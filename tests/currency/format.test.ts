import { describe, expect, it } from "vitest";
import { formatDiscount, formatINR } from "../../src/currency/format";

describe("formatINR", () => {
  it("formats whole rupees with the rupee sign", () => {
    expect(formatINR(349)).toBe("₹349.00");
  });

  it("always shows two decimal places", () => {
    expect(formatINR(1049.25)).toBe("₹1,049.25");
  });

  it("uses Indian digit grouping", () => {
    expect(formatINR(123456.5)).toBe("₹1,23,456.50");
  });

  it("formats zero", () => {
    expect(formatINR(0)).toBe("₹0.00");
  });

  it("formats negative amounts", () => {
    expect(formatINR(-20)).toBe("-₹20.00");
  });
});

describe("formatDiscount", () => {
  it("prefixes discounts with a minus sign", () => {
    expect(formatDiscount(200)).toBe("−₹200.00");
  });

  it("shows a zero discount without a sign", () => {
    expect(formatDiscount(0)).toBe("₹0.00");
  });
});

describe("formatINR edge cases", () => {
  it("groups crores", () => {
    expect(formatINR(10_000_000)).toBe("₹1,00,00,000.00");
  });

  it("hides floating-point noise", () => {
    expect(formatINR(19.99 * 3)).toBe("₹59.97");
  });

  it("formats fractional discounts", () => {
    expect(formatDiscount(24.98)).toBe("−₹24.98");
  });
});
