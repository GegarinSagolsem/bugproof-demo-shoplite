import { describe, expect, it } from "vitest";
import { estimateDelivery } from "../../src/delivery/estimate";

// 10 March 2026 is a Tuesday.
describe("estimateDelivery", () => {
  it("adds three days of transit to a morning order", () => {
    expect(estimateDelivery(new Date("2026-03-10T10:00:00+05:30"))).toBe("2026-03-13");
  });

  it("supports a custom transit time", () => {
    expect(estimateDelivery(new Date("2026-03-10T10:00:00+05:30"), 1)).toBe("2026-03-11");
  });

  it("uses the IST calendar date for early-morning orders", () => {
    // 01:00 IST on the 10th is still the 9th in UTC.
    expect(estimateDelivery(new Date("2026-03-10T01:00:00+05:30"))).toBe("2026-03-13");
  });

  it("returns an ISO calendar date", () => {
    expect(estimateDelivery(new Date())).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });
});
