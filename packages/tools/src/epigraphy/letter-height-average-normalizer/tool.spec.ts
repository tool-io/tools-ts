import { describe, expect, it } from "vitest";
import {
  calculateLetterHeightAverageNormalizer,
  letterHeightAverageNormalizerExample,
  runLetterHeightAverageNormalizer,
} from "./tool.js";

describe("epigraphy/letter-height-average-normalizer", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runLetterHeightAverageNormalizer(
        letterHeightAverageNormalizerExample.input,
      ),
    ).toEqual({
      ok: true,
      output: letterHeightAverageNormalizerExample.output,
    });
  });

  it("handles fractional measurements", () => {
    expect(
      calculateLetterHeightAverageNormalizer({
        letterHeightsMm: [9.5, 10.5],
      }),
    ).toEqual({
      averageHeightMm: 10,
      shortestMm: 9.5,
      tallestMm: 10.5,
      sampleCount: 2,
    });
  });

  it("rejects empty lists and non-positive heights", () => {
    expect(runLetterHeightAverageNormalizer({ letterHeightsMm: [] }).ok).toBe(
      false,
    );
    expect(
      runLetterHeightAverageNormalizer({ letterHeightsMm: [10, -2] }).ok,
    ).toBe(false);
  });
});
