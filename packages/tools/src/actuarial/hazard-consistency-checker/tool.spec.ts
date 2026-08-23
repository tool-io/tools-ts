import { describe, expect, it } from "vitest";
import {
  calculateHazardConsistency,
  hazardConsistencyCheckerExample,
  runHazardConsistencyChecker,
} from "./tool.js";

describe("hazard consistency checker", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runHazardConsistencyChecker(hazardConsistencyCheckerExample.input),
    ).toEqual({
      ok: true,
      output: hazardConsistencyCheckerExample.output,
    });
  });

  it("flags mismatched inputs as inconsistent", () => {
    const result = calculateHazardConsistency({
      annualDeathProbability: 0.5,
      forceOfMortality: 0.1,
      tolerance: 0.01,
    });
    expect(result.consistent).toBe(false);
    expect(result.impliedDeathProbability).toBeCloseTo(0.09516258196404048, 12);
  });

  it("accepts differences exactly at the tolerance", () => {
    const result = calculateHazardConsistency({
      annualDeathProbability: 0,
      forceOfMortality: 0,
      tolerance: 0,
    });
    expect(result.consistent).toBe(true);
  });

  it("preserves precision for a very small force of mortality", () => {
    expect(
      calculateHazardConsistency({
        annualDeathProbability: 1e-16,
        forceOfMortality: 1e-16,
        tolerance: 0,
      }),
    ).toEqual({ consistent: true, impliedDeathProbability: 1e-16 });
  });

  it("rejects negative tolerances with a stable code", () => {
    expect(
      runHazardConsistencyChecker({
        annualDeathProbability: 0.5,
        forceOfMortality: 0.6931471805599453,
        tolerance: -1,
      }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_field", field: "tolerance" }] },
      ok: false,
    });
  });

  it("rejects invalid rates with field-specific issues", () => {
    expect(
      runHazardConsistencyChecker({
        annualDeathProbability: -2,
        forceOfMortality: 0.5,
      }),
    ).toMatchObject({
      error: {
        issues: [{ code: "invalid_field", field: "annualDeathProbability" }],
      },
      ok: false,
    });
    expect(
      runHazardConsistencyChecker({
        annualDeathProbability: 0.5,
        forceOfMortality: Number.NaN,
      }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_field", field: "forceOfMortality" }] },
      ok: false,
    });
  });

  it("guards non-finite direct-call inputs", () => {
    expect(() =>
      calculateHazardConsistency({
        annualDeathProbability: 0.5,
        forceOfMortality: Number.POSITIVE_INFINITY,
      }),
    ).toThrowError("The force of mortality must be finite and nonnegative");
    expect(() =>
      calculateHazardConsistency({
        annualDeathProbability: 0.5,
        forceOfMortality: 0.5,
        tolerance: Number.NaN,
      }),
    ).toThrowError("The tolerance must be finite and nonnegative");
  });
});
