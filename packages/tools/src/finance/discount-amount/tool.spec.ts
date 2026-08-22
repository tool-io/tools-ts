import { describe, expect, it } from "vitest";
import { runDiscountAmount } from "./tool.js";

describe("Discount Amount Calculator", () => {
  it("calculates a valid result", () => {
    expect(runDiscountAmount({ discountPercent: 25, price: 80 })).toEqual({
      ok: true,
      output: { discountAmount: 20 },
    });
  });

  it("rejects invalid input", () =>
    expect(runDiscountAmount(null).ok).toBe(false));
});
