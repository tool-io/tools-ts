import { describe, expect, it } from "vitest";
import { runExpenseRatioCost } from "./tool.js";
describe("Expense Ratio Cost Calculator", () => {
  it("calculates a valid result", () => {
    expect(
      runExpenseRatioCost({ assets: 50000, expenseRatioPercent: 0.2 }),
    ).toEqual({ ok: true, output: { annualCost: 100 } });
  });
  it("rejects invalid input", () =>
    expect(runExpenseRatioCost(null).ok).toBe(false));
});
