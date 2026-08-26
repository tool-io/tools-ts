import { describe, expect, it } from "vitest";
import {
  calculateIntrinsicDeathRateDStable,
  runIntrinsicDeathRateDStable,
  intrinsicDeathRateDStableExample,
} from "./tool.js";

describe("demography/intrinsic-death-rate-d-stable", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runIntrinsicDeathRateDStable(intrinsicDeathRateDStableExample.input),
    ).toEqual({
      ok: true,
      output: intrinsicDeathRateDStableExample.output,
    });
  });

  it("accepts death rates instead of absolute deaths", () => {
    expect(
      calculateIntrinsicDeathRateDStable({
        growthRateR: 0,
        ages: [0],
        personYearsLx: [80],
        deathRatesMx: [0.0125],
      }).deathRateD,
    ).toBe(0.0125);
  });

  it("rejects missing death information and misaligned lists", () => {
    expect(
      runIntrinsicDeathRateDStable({
        growthRateR: 0,
        ages: [0],
        personYearsLx: [80],
      }).ok,
    ).toBe(false);
    expect(
      runIntrinsicDeathRateDStable({
        growthRateR: 0,
        ages: [0, 10],
        personYearsLx: [80, 79],
        deaths: [1],
      }).ok,
    ).toBe(false);
    expect(
      runIntrinsicDeathRateDStable({
        growthRateR: 0,
        ages: [0, 10],
        personYearsLx: [80, 79],
        deathRatesMx: [0.01],
      }).ok,
    ).toBe(false);
  });
});
