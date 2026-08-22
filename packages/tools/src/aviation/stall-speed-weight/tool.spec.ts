import { describe, expect, it } from "vitest";
import {
  calculateStallSpeedWeight,
  runStallSpeedWeight,
  stallSpeedWeightExample,
} from "./tool.js";

describe("stall speed weight correction calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runStallSpeedWeight(stallSpeedWeightExample.input)).toEqual({
      ok: true,
      output: stallSpeedWeightExample.output,
    });
  });

  it("returns the published speed at the published weight", () => {
    expect(
      calculateStallSpeedWeight({
        newWeightLb: 2000,
        publishedStallSpeedKt: 50,
        publishedWeightLb: 2000,
      }),
    ).toEqual({ stallSpeedKt: 50 });
  });

  it("rejects non-positive weights through execution", () => {
    for (const bad of [
      { newWeightLb: 0, publishedStallSpeedKt: 50, publishedWeightLb: 2000 },
      { newWeightLb: -5, publishedStallSpeedKt: 50, publishedWeightLb: 2000 },
      {
        newWeightLb: 2400,
        publishedStallSpeedKt: 50,
        publishedWeightLb: -2000,
      },
    ])
      expect(runStallSpeedWeight(bad).ok).toBe(false);
  });
});
