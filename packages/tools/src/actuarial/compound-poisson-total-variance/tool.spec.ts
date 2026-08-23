import { describe, expect, it } from "vitest";
import {
  calculateCompoundPoissonTotalVariance,
  compoundPoissonTotalVarianceExample,
  runCompoundPoissonTotalVariance,
} from "./tool.js";

describe("Compound Poisson Total Variance Calculator", () => {
  it("reproduces its canonical example", () => {
    expect(
      runCompoundPoissonTotalVariance(
        compoundPoissonTotalVarianceExample.input,
      ),
    ).toEqual({
      ok: true,
      output: compoundPoissonTotalVarianceExample.output,
    });
  });

  it("uses claim frequency times the severity second raw moment", () => {
    expect(
      calculateCompoundPoissonTotalVariance({
        claimFrequency: 4,
        severitySecondMoment: 225,
      }),
    ).toEqual({ standardDeviation: 30, totalVariance: 900 });
  });

  it("returns zero variance for zero frequency", () => {
    expect(
      runCompoundPoissonTotalVariance({
        claimFrequency: 0,
        severitySecondMoment: 225,
      }),
    ).toEqual({
      ok: true,
      output: { standardDeviation: 0, totalVariance: 0 },
    });
  });

  it("rejects negative and malformed inputs", () => {
    expect(
      runCompoundPoissonTotalVariance({
        claimFrequency: -1,
        severitySecondMoment: 225,
      }).ok,
    ).toBe(false);
    expect(
      runCompoundPoissonTotalVariance({
        claimFrequency: 4,
        severitySecondMoment: -1,
      }).ok,
    ).toBe(false);
    expect(runCompoundPoissonTotalVariance(null).ok).toBe(false);
  });
});
