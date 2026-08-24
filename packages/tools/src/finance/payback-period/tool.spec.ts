import { describe, expect, it } from "vitest";
import {
  paybackPeriodExample,
  calculatePaybackPeriod,
  runPaybackPeriod,
} from "./tool.js";

describe("finance/payback-period", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runPaybackPeriod(paybackPeriodExample.input)).toEqual({
      ok: true,
      output: paybackPeriodExample.output,
    });
  });
  it("rejects invalid input (invalid_investment)", () => {
    expect(
      runPaybackPeriod({ initialInvestment: 0, cashFlows: [100] }).ok,
    ).toBe(false);
  });
  it("rejects invalid input (empty_list)", () => {
    expect(runPaybackPeriod({ initialInvestment: 100, cashFlows: [] }).ok).toBe(
      false,
    );
  });
  it("rejects invalid input (never_recovered)", () => {
    expect(
      runPaybackPeriod({ initialInvestment: 1000, cashFlows: [100, 100] }).ok,
    ).toBe(false);
  });
  it("recovers mid-year with fractional interpolation", () => {
    const result = runPaybackPeriod({
      initialInvestment: 1000,
      cashFlows: [600, 600],
    });
    expect(result.ok).toBe(true);
    if (result.ok)
      expect(result.output.paybackPeriodYears).toBeCloseTo(5 / 3, 9);
  });
});
