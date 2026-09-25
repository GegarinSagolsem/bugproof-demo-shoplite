import { describe, expect, it } from "vitest";
import { calculateGst, GST_RATE, GST_RATE_PERCENT } from "../../src/tax/gst";

describe("calculateGst", () => {
  it("charges the standard 18% slab by default", () => {
    expect(GST_RATE_PERCENT).toBe(18);
    expect(GST_RATE).toBe(0.18);
    expect(calculateGst(1000)).toBe(180);
  });

  it("rounds to the nearest paisa", () => {
    expect(calculateGst(349)).toBe(62.82);
  });

  it("rounds half a paisa up", () => {
    expect(calculateGst(249.75)).toBe(44.96);
  });

  it("supports other GST slabs", () => {
    expect(calculateGst(199, 5)).toBe(9.95);
  });

  it("is zero for a zero amount", () => {
    expect(calculateGst(0)).toBe(0);
  });

  it("rejects negative rates", () => {
    expect(() => calculateGst(100, -1)).toThrow(RangeError);
  });
});

describe("calculateGst on fractional amounts", () => {
  it("rounds half a paisa up for small amounts", () => {
    expect(calculateGst(149.25)).toBe(26.87);
  });

  it("rounds half a paisa up for amounts over ₹1,000", () => {
    expect(calculateGst(1049.25)).toBe(188.87);
  });
});
