import { describe, expect, it } from "vitest";
import { paginate } from "../../src/catalog/paginate";
import { PRODUCTS } from "../../src/catalog/products";

const numbers = Array.from({ length: 10 }, (_, i) => i + 1);

describe("paginate", () => {
  it("returns the first page", () => {
    const page = paginate(numbers, 1, 4);
    expect(page.items).toEqual([1, 2, 3, 4]);
    expect(page.page).toBe(1);
  });

  it("returns a middle page", () => {
    expect(paginate(numbers, 2, 4).items).toEqual([5, 6, 7, 8]);
  });

  it("computes the total number of pages", () => {
    expect(paginate(numbers, 1, 4).totalPages).toBe(3);
    expect(paginate(numbers, 1, 5).totalPages).toBe(2);
  });

  it("clamps out-of-range page numbers", () => {
    expect(paginate(numbers, 99, 4).page).toBe(3);
    expect(paginate(numbers, 0, 4).page).toBe(1);
  });

  it("handles an empty list", () => {
    const page = paginate([], 1, 6);
    expect(page.items).toEqual([]);
    expect(page.totalPages).toBe(1);
  });

  it("rejects a non-positive page size", () => {
    expect(() => paginate(numbers, 1, 0)).toThrow(RangeError);
  });
});

describe("paginate metadata", () => {
  it("reports neighbouring pages", () => {
    expect(paginate(numbers, 2, 4)).toMatchObject({ hasPrev: true, hasNext: true });
    expect(paginate(numbers, 1, 4)).toMatchObject({ hasPrev: false, hasNext: true });
  });

  it("reports the total item count", () => {
    expect(paginate(PRODUCTS, 2, 6)).toMatchObject({ totalItems: 25, pageSize: 6 });
  });
});
