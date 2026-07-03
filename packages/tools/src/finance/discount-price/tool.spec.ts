import { describe, expect, it } from "vitest";
import { runDiscountPrice } from "./tool.js";
describe("Discount Price Calculator", () => {
  it("calculates a valid result", () => {
    expect(
      runDiscountPrice({ originalPrice: 80, discountPercent: 25 }),
    ).toEqual({ ok: true, output: { discountAmount: 20, finalPrice: 60 } });
  });
  it("rejects invalid input", () =>
    expect(runDiscountPrice(null).ok).toBe(false));
});
