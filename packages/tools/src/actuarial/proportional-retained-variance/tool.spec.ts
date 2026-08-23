import { describe, expect, it } from "vitest";
import {
  calculateProportionalRetainedVariance,
  proportionalRetainedVarianceExample,
  runProportionalRetainedVariance,
} from "./tool.js";

describe("proportional reinsurance retained variance calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runProportionalRetainedVariance(
        proportionalRetainedVarianceExample.input,
      ),
    ).toEqual({
      ok: true,
      output: proportionalRetainedVarianceExample.output,
    });
  });

  it("scales variance with the square of the retained share", () => {
    expect(
      calculateProportionalRetainedVariance({
        cededShare: 0.5,
        totalVariance: 50000,
      }),
    ).toEqual({ retainedVariance: 12500 });
  });

  it("keeps full variance when nothing is ceded", () => {
    expect(
      calculateProportionalRetainedVariance({
        cededShare: 0,
        totalVariance: 50000,
      }),
    ).toEqual({ retainedVariance: 50000 });
  });

  it("rejects shares outside the unit interval", () => {
    expect(
      runProportionalRetainedVariance({
        cededShare: 1.5,
        totalVariance: 50000,
      }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_field", field: "cededShare" }] },
      ok: false,
    });
  });
});
