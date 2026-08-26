import { describe, expect, it } from "vitest";
import {
  calculateEverMarriedByAgeInterpolation,
  everMarriedByAgeInterpolationExample,
  runEverMarriedByAgeInterpolation,
} from "./tool.js";

describe("ever-married-by-age-interpolation", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runEverMarriedByAgeInterpolation(
        everMarriedByAgeInterpolationExample.input,
      ),
    ).toEqual({
      ok: true,
      output: everMarriedByAgeInterpolationExample.output,
    });
  });

  it("clamps to the first group below its midpoint", () => {
    const r = calculateEverMarriedByAgeInterpolation({
      proportionEverMarried: [0.11, 0.42, 0.73],
      targetAge: 10,
      startAge: 15,
      intervalWidth: 5,
    });
    expect(r.everMarriedProportion).toBe(0.11);
  });

  it("rejects proportions outside the unit interval", () => {
    expect(
      runEverMarriedByAgeInterpolation({
        proportionEverMarried: [0.2, -0.1],
        targetAge: 20,
      }).ok,
    ).toBe(false);
  });
});
