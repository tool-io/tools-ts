import { describe, expect, it } from "vitest";
import {
  calculateSerifEraClassifier,
  runSerifEraClassifier,
  serifEraClassifierExample,
} from "./tool.js";

describe("epigraphy/serif-era-classifier", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runSerifEraClassifier(serifEraClassifierExample.input)).toEqual({
      ok: true,
      output: serifEraClassifierExample.output,
    });
  });

  it("assigns bold slab serifs to the imperial class", () => {
    expect(
      calculateSerifEraClassifier({
        averageSerifWidthMm: 2,
        averageStrokeWidthMm: 4,
      }),
    ).toEqual({ serifToStrokeRatio: 0.5, era: "imperial" });
  });

  it("honors custom thresholds at the boundary", () => {
    const result = calculateSerifEraClassifier({
      averageSerifWidthMm: 1,
      averageStrokeWidthMm: 5,
      thresholdRatio: 0.2,
    });
    expect(result.serifToStrokeRatio).toBe(0.2);
    expect(result.era).toBe("imperial");
  });

  it("rejects non-positive measurements", () => {
    expect(
      runSerifEraClassifier({ averageSerifWidthMm: 1, averageStrokeWidthMm: 0 })
        .ok,
    ).toBe(false);
  });
});
