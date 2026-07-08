import { describe, expect, it } from "vitest";
import { runProfitMargin } from "./tool.js";
describe("Profit Margin Calculator", () => {
  it("calculates a valid result", () => {
    expect(runProfitMargin({ revenue: 200, cost: 150 })).toEqual({
      ok: true,
      output: { profit: 50, profitMarginPercent: 25 },
    });
  });
  it("rejects invalid input", () =>
    expect(runProfitMargin(null).ok).toBe(false));
});
