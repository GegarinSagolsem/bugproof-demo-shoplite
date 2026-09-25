import { describe, expect, it } from "vitest";
import { parseCouponRule } from "../../src/cart/coupons";

describe("parseCouponRule", () => {
  it("parses percentage rules", () => {
    expect(parseCouponRule("10%")).toEqual({ kind: "percent", value: 10 });
  });

  it("parses flat rupee rules", () => {
    expect(parseCouponRule("200")).toEqual({ kind: "flat", value: 200 });
  });

  it("keeps fractional percentages", () => {
    expect(parseCouponRule("12.5%")).toEqual({ kind: "percent", value: 12.5 });
  });
});
