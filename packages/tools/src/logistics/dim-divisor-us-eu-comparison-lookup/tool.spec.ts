import { describe, expect, it } from "vitest";
import {
  calculateDimDivisorUsEuComparisonLookup,
  dimDivisorUsEuComparisonLookupExample,
  runDimDivisorUsEuComparisonLookup,
} from "./tool.js";

describe("dim-divisor-us-eu-comparison-lookup", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runDimDivisorUsEuComparisonLookup(
        dimDivisorUsEuComparisonLookupExample.input,
      ),
    ).toEqual({
      ok: true,
      output: dimDivisorUsEuComparisonLookupExample.output,
    });
  });

  it("matches the two divisors exactly when they are equal", () => {
    const result = runDimDivisorUsEuComparisonLookup({
      lengthCm: 50,
      widthCm: 50,
      heightCm: 50,
      usExpressDivisorCm3PerKg: 4000,
      euRoadDivisorCm3PerKg: 4000,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.volumetricDifferenceKg as number).toBe(0);
  });
  it("rejects non-positive dimensions", () => {
    expect(
      runDimDivisorUsEuComparisonLookup({
        lengthCm: -1,
        widthCm: 40,
        heightCm: 40,
      }).ok,
    ).toBe(false);
  });
  it("rejects non-finite direct dimensions", () => {
    expect(() =>
      calculateDimDivisorUsEuComparisonLookup({
        heightCm: 40,
        lengthCm: Number.NaN,
        widthCm: 40,
      }),
    ).toThrow("must be finite");
  });
});
