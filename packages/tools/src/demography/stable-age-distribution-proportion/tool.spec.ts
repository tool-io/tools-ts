import { describe, expect, it } from "vitest";
import {
  calculateStableAgeDistributionProportion,
  runStableAgeDistributionProportion,
  stableAgeDistributionProportionExample,
} from "./tool.js";

describe("demography/stable-age-distribution-proportion", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runStableAgeDistributionProportion(
        stableAgeDistributionProportionExample.input,
      ),
    ).toEqual({
      ok: true,
      output: stableAgeDistributionProportionExample.output,
    });
  });

  it("is uniform under zero growth with equal weights", () => {
    expect(
      calculateStableAgeDistributionProportion({
        growthRateR: 0,
        ages: [0, 30],
        weights: [2, 2],
      }),
    ).toEqual({ proportions: [0.5, 0.5], meanAge: 15 });
  });

  it("rejects misaligned or non-positive-weightable lists", () => {
    expect(
      runStableAgeDistributionProportion({
        growthRateR: 0.01,
        ages: [0],
        weights: [1, 1],
      }).ok,
    ).toBe(false);
    expect(
      runStableAgeDistributionProportion({
        growthRateR: 0.01,
        ages: [0, 10],
        weights: [0, 0],
      }).ok,
    ).toBe(false);
    expect(
      runStableAgeDistributionProportion({
        growthRateR: Number.NaN,
        ages: [0],
        weights: [1],
      }).ok,
    ).toBe(false);
  });
});
