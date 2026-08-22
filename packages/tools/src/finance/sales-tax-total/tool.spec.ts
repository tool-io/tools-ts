import { describe, expect, it } from "vitest";
import { runSalesTaxTotal } from "./tool.js";

describe("Sales Tax Total Calculator", () => {
  it("calculates a valid result", () => {
    expect(runSalesTaxTotal({ amount: 100, taxRatePercent: 8.25 })).toEqual({
      ok: true,
      output: { taxAmount: 8.25, total: 108.25 },
    });
  });

  it("handles a zero rate", () => {
    expect(runSalesTaxTotal({ amount: 50, taxRatePercent: 0 })).toEqual({
      ok: true,
      output: { taxAmount: 0, total: 50 },
    });
  });

  it("rejects invalid input", () =>
    expect(runSalesTaxTotal(null).ok).toBe(false));
});
