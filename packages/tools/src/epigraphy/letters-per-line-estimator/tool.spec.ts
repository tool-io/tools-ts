import { describe, expect, it } from "vitest";
import {
  calculateLettersPerLineEstimator,
  lettersPerLineEstimatorExample,
  runLettersPerLineEstimator,
} from "./tool.js";

describe("epigraphy/letters-per-line-estimator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runLettersPerLineEstimator(lettersPerLineEstimatorExample.input),
    ).toEqual({ ok: true, output: lettersPerLineEstimatorExample.output });
  });

  it("floors fractional capacities with spacing included", () => {
    expect(
      calculateLettersPerLineEstimator({
        stoneWidthMm: 500,
        averageLetterAdvanceMm: 10,
        letterSpacingMm: 2,
      }),
    ).toEqual({ estimatedLettersPerLine: 41, effectivePitchMm: 12 });
  });

  it("rejects non-positive widths or advances", () => {
    expect(
      runLettersPerLineEstimator({
        stoneWidthMm: 0,
        averageLetterAdvanceMm: 10,
      }).ok,
    ).toBe(false);
    expect(
      runLettersPerLineEstimator({
        stoneWidthMm: 500,
        averageLetterAdvanceMm: -10,
      }).ok,
    ).toBe(false);
  });
});
