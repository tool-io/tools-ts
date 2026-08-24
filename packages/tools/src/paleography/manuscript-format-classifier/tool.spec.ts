import { describe, expect, it } from "vitest";
import {
  manuscriptFormatClassifierExample,
  runManuscriptFormatClassifier,
} from "./tool.js";

describe("manuscript-format-classifier", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runManuscriptFormatClassifier(manuscriptFormatClassifierExample.input),
    ).toEqual({ ok: true, output: manuscriptFormatClassifierExample.output });
  });

  it("classifies a pocket gospel as octavo", () => {
    const result = runManuscriptFormatClassifier({
      leafHeightMm: 150,
      leafWidthMm: 100,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.format as string).toBe("octavo");
    expect(result.output.aspectRatio as number).toBeCloseTo(100 / 150);
  });

  it("rejects inverted thresholds", () => {
    expect(
      runManuscriptFormatClassifier({
        leafHeightMm: 150,
        leafWidthMm: 100,
        folioMinimumHeightMm: 100,
        quartoMinimumHeightMm: 120,
        octavoMinimumHeightMm: 140,
      }).ok,
    ).toBe(false);
  });

  it("rejects non-positive dimensions", () => {
    expect(
      runManuscriptFormatClassifier({ leafHeightMm: 0, leafWidthMm: 100 }).ok,
    ).toBe(false);
  });

  it("rejects dimensions that overflow the aspect ratio", () => {
    expect(
      runManuscriptFormatClassifier({
        leafHeightMm: Number.MIN_VALUE,
        leafWidthMm: Number.MAX_VALUE,
      }).ok,
    ).toBe(false);
    expect(
      runManuscriptFormatClassifier({
        leafHeightMm: Number.MAX_VALUE,
        leafWidthMm: Number.MIN_VALUE,
      }).ok,
    ).toBe(false);
  });
});
