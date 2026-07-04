import { describe, expect, it } from "vitest";
import { runGrossMargin } from "./tool.js";
describe("Gross Margin Calculator", () => {
  it("calculates a valid result", () => {
    expect(runGrossMargin({ revenue: 1000, costOfGoodsSold: 600 })).toEqual({
      ok: true,
      output: { grossProfit: 400, grossMarginPercent: 40 },
    });
  });
  it("rejects invalid input", () =>
    expect(runGrossMargin(null).ok).toBe(false));
});
