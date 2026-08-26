import { describe, expect, it } from "vitest";
import {
  calculateIntrinsicBirthRateBStable,
  runIntrinsicBirthRateBStable,
  intrinsicBirthRateBStableExample,
} from "./tool.js";

describe("demography/intrinsic-birth-rate-b-stable", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runIntrinsicBirthRateBStable(intrinsicBirthRateBStableExample.input),
    ).toEqual({
      ok: true,
      output: intrinsicBirthRateBStableExample.output,
    });
  });

  it("recovers a unit radix stationary population birth rate", () => {
    const result = calculateIntrinsicBirthRateBStable({
      growthRateR: 0,
      ages: [0],
      personYearsLx: [80],
    });
    expect(result.birthRateB).toBe(1 / 80);
    expect(result.deathRateD).toBe(1 / 80);
  });

  it("rejects misaligned or non-positive exposures", () => {
    expect(
      runIntrinsicBirthRateBStable({
        growthRateR: 0,
        ages: [0],
        personYearsLx: [1, 2],
      }).ok,
    ).toBe(false);
    expect(
      runIntrinsicBirthRateBStable({
        growthRateR: 0,
        ages: [0],
        personYearsLx: [0],
      }).ok,
    ).toBe(false);
    expect(
      runIntrinsicBirthRateBStable({
        growthRateR: Number.NaN,
        ages: [0],
        personYearsLx: [1],
      }).ok,
    ).toBe(false);
  });
});
