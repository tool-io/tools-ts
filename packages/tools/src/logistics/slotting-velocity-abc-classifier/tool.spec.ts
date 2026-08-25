import { describe, expect, it } from "vitest";
import {
  calculateSlottingVelocityAbcClassifier,
  slottingVelocityAbcClassifierExample,
  runSlottingVelocityAbcClassifier,
} from "./tool.js";

describe("slotting-velocity-abc-classifier", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runSlottingVelocityAbcClassifier(
        slottingVelocityAbcClassifierExample.input,
      ),
    ).toEqual({
      ok: true,
      output: slottingVelocityAbcClassifierExample.output,
    });
  });

  it("places tail items in class C past the second boundary", () => {
    const result = runSlottingVelocityAbcClassifier({
      cumulativeThroughputSharePercent: 99,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.velocityClass).toBe("C");
  });
  it("rejects shares above one hundred percent", () => {
    expect(
      runSlottingVelocityAbcClassifier({
        cumulativeThroughputSharePercent: 120,
      }).ok,
    ).toBe(false);
  });

  it("rejects non-finite thresholds in the direct API", () => {
    expect(() =>
      calculateSlottingVelocityAbcClassifier({
        cumulativeThroughputSharePercent: 50,
        fastMovingBoundaryPercent: Number.NaN,
      }),
    ).toThrow("A boundary");
  });
});
