import { describe, expect, it } from "vitest";
import { runDebtToIncomeRatio } from "./tool.js";
describe("Debt-to-Income Ratio Calculator", () => {
  it("calculates a valid result", () => {
    expect(
      runDebtToIncomeRatio({ monthlyDebt: 1500, grossMonthlyIncome: 5000 }),
    ).toEqual({ ok: true, output: { ratio: 0.3, percent: 30 } });
  });
  it("rejects invalid input", () =>
    expect(runDebtToIncomeRatio(null).ok).toBe(false));
});
