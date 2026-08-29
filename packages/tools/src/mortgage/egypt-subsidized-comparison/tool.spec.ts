import { describe, expect, it } from "vitest";
import {
  egyptSubsidizedComparisonExample,
  runEgyptSubsidizedComparison,
} from "./tool.js";

describe("Egypt subsidized mortgage comparison", () => {
  it("reproduces its canonical comparison", () => {
    expect(
      runEgyptSubsidizedComparison(egyptSubsidizedComparisonExample.input),
    ).toEqual({ ok: true, output: egyptSubsidizedComparisonExample.output });
  });

  it("reports zero savings for equal rates", () => {
    expect(
      runEgyptSubsidizedComparison({
        marketAnnualRatePercent: 5,
        principal: 100_000,
        subsidizedAnnualRatePercent: 5,
        termYears: 10,
      }),
    ).toMatchObject({
      ok: true,
      output: { monthlyPaymentSavings: 0, totalInterestSavings: 0 },
    });
  });

  it("rejects a zero principal", () => {
    const result = runEgyptSubsidizedComparison({
      marketAnnualRatePercent: 12,
      principal: 0,
      subsidizedAnnualRatePercent: 8,
      termYears: 20,
    });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0]).toMatchObject({
        code: "principal_not_positive",
        field: "principal",
      });
  });
});
