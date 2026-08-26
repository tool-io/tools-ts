import { describe, expect, it } from "vitest";
import {
  calculateIntercensalExponentialEstimator,
  runIntercensalExponentialEstimator,
  intercensalExponentialEstimatorExample,
} from "./tool.js";

describe("demography/intercensal-exponential-estimator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runIntercensalExponentialEstimator(
        intercensalExponentialEstimatorExample.input,
      ),
    ).toEqual({
      ok: true,
      output: intercensalExponentialEstimatorExample.output,
    });
  });

  it("returns the start population at t equals zero and the end population at the full interval", () => {
    expect(
      calculateIntercensalExponentialEstimator({
        startPopulation: 100,
        endPopulation: 400,
        intervalYears: 2,
        yearsFromStart: 0,
      }).estimatedPopulation,
    ).toBeCloseTo(100, 12);
    expect(
      calculateIntercensalExponentialEstimator({
        startPopulation: 100,
        endPopulation: 400,
        intervalYears: 2,
        yearsFromStart: 2,
      }).estimatedPopulation,
    ).toBeCloseTo(400, 12);
  });

  it("rejects non-positive populations and times outside the interval", () => {
    expect(
      runIntercensalExponentialEstimator({
        startPopulation: 0,
        endPopulation: 100,
        intervalYears: 10,
        yearsFromStart: 5,
      }).ok,
    ).toBe(false);
    expect(
      runIntercensalExponentialEstimator({
        startPopulation: 100,
        endPopulation: 200,
        intervalYears: 10,
        yearsFromStart: 11,
      }).ok,
    ).toBe(false);
  });
});
