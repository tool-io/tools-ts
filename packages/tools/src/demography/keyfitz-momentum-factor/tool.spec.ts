import { describe, expect, it } from "vitest";
import {
  calculateKeyfitzMomentumFactor,
  runKeyfitzMomentumFactor,
  keyfitzMomentumFactorExample,
} from "./tool.js";

describe("demography/keyfitz-momentum-factor", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runKeyfitzMomentumFactor(keyfitzMomentumFactorExample.input),
    ).toEqual({
      ok: true,
      output: keyfitzMomentumFactorExample.output,
    });
  });

  it("falls back to b times e0 as r approaches zero", () => {
    expect(
      calculateKeyfitzMomentumFactor({
        birthRateB: 1 / 70,
        lifeExpectancy0: 70,
        growthRateR: 0,
        meanAgeChildbearing: 28,
      }),
    ).toEqual({ momentumFactor: 1 });
  });

  it("rejects non-positive rates or ages", () => {
    expect(
      runKeyfitzMomentumFactor({
        birthRateB: 0,
        lifeExpectancy0: 65,
        growthRateR: 0.02,
        meanAgeChildbearing: 27,
      }).ok,
    ).toBe(false);
    expect(
      runKeyfitzMomentumFactor({
        birthRateB: 0.03,
        lifeExpectancy0: -5,
        growthRateR: 0.02,
        meanAgeChildbearing: 27,
      }).ok,
    ).toBe(false);
  });
});
