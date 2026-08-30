import { describe, expect, it } from "vitest";
import {
  flagSignificantRiskFraudFactors,
  runSignificantRiskFraud,
  significantRiskFraudExample,
} from "./tool.js";

describe("significant risk fraud factor checker", () => {
  it("reproduces its canonical example", () => {
    expect(runSignificantRiskFraud(significantRiskFraudExample.input)).toEqual({
      ok: true,
      output: significantRiskFraudExample.output,
    });
  });

  it("does not flag when no misstatement risk is identified", () => {
    expect(
      flagSignificantRiskFraudFactors({
        financialStatementMisstatementRisk: false,
        managementPressure: true,
        minimumFactors: 1,
        opportunity: true,
        rationalization: true,
      }).significantRisk,
    ).toBe(false);
  });

  it("flags at the exact factor threshold", () => {
    expect(
      flagSignificantRiskFraudFactors({
        financialStatementMisstatementRisk: true,
        managementPressure: true,
        minimumFactors: 1,
        opportunity: false,
        rationalization: false,
      }),
    ).toEqual({ factorCount: 1, significantRisk: true });
  });

  it("rejects a zero factor threshold", () => {
    expect(
      runSignificantRiskFraud({
        financialStatementMisstatementRisk: true,
        managementPressure: false,
        minimumFactors: 0,
        opportunity: false,
        rationalization: false,
      }),
    ).toMatchObject({
      error: {
        issues: [{ code: "invalid_field", field: "minimumFactors" }],
      },
      ok: false,
    });
  });
});
