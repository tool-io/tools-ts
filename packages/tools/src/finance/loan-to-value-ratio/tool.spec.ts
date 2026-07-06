import { describe, expect, it } from "vitest";
import { runLoanToValueRatio } from "./tool.js";
describe("Loan-to-Value Ratio Calculator", () => {
  it("calculates a valid result", () => {
    expect(
      runLoanToValueRatio({ loanAmount: 240000, propertyValue: 300000 }),
    ).toEqual({ ok: true, output: { ratio: 0.8, percent: 80 } });
  });
  it("rejects invalid input", () =>
    expect(runLoanToValueRatio(null).ok).toBe(false));
});
