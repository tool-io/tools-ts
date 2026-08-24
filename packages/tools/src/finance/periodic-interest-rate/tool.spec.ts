import { describe, expect, it } from "vitest";
import {
  periodicInterestRateExample,
  calculatePeriodicInterestRate,
  runPeriodicInterestRate,
} from "./tool.js";

describe("finance/periodic-interest-rate", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runPeriodicInterestRate(periodicInterestRateExample.input)).toEqual({
      ok: true,
      output: periodicInterestRateExample.output,
    });
  });
  it("supports a negative nominal rate when each period remains above -100%", () => {
    const result = runPeriodicInterestRate({ annualRatePercent: -12 });
    expect(result.ok).toBe(true);
    if (result.ok)
      expect(result.output.effectiveAnnualRatePercent).toBeLessThan(0);
  });
  it("rejects invalid input (periodsPerYear)", () => {
    expect(
      runPeriodicInterestRate({ annualRatePercent: 5, periodsPerYear: 0 }).ok,
    ).toBe(false);
  });
  it("compounds quarterly at two percent per period for eight percent nominal", () => {
    const result = runPeriodicInterestRate({
      annualRatePercent: 8,
      periodsPerYear: 4,
    });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.output.periodicRatePercent).toBe(2);
      expect(result.output.effectiveAnnualRatePercent).toBeCloseTo(
        8.243216,
        12,
      );
    }
  });
});
