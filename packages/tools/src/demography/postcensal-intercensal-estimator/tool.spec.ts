import { describe, expect, it } from "vitest";
import {
  calculatePostcensalIntercensalEstimator,
  runPostcensalIntercensalEstimator,
  postcensalIntercensalEstimatorExample,
} from "./tool.js";

describe("demography/postcensal-intercensal-estimator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runPostcensalIntercensalEstimator(
        postcensalIntercensalEstimatorExample.input,
      ),
    ).toEqual({
      ok: true,
      output: postcensalIntercensalEstimatorExample.output,
    });
  });

  it("interpolates linearly halfway between two censuses", () => {
    expect(
      calculatePostcensalIntercensalEstimator({
        mode: "intercensal",
        basePopulation: 1000000,
        endPopulation: 1200000,
        fractionElapsed: 0.5,
      }),
    ).toEqual({ estimatedPopulation: 1100000 });
  });

  it("rejects missing later census and out-of-range fractions", () => {
    expect(
      runPostcensalIntercensalEstimator({
        mode: "intercensal",
        basePopulation: 100,
      }).ok,
    ).toBe(false);
    expect(
      runPostcensalIntercensalEstimator({
        mode: "intercensal",
        basePopulation: 100,
        endPopulation: 200,
        fractionElapsed: 1.5,
      }).ok,
    ).toBe(false);
    expect(
      runPostcensalIntercensalEstimator({
        basePopulation: 100,
        deaths: 200,
      }).ok,
    ).toBe(false);
  });
});
