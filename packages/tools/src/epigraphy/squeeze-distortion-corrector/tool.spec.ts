import { describe, expect, it } from "vitest";
import {
  runSqueezeDistortionCorrector,
  squeezeDistortionCorrectorExample,
} from "./tool.js";

describe("squeeze-distortion-corrector", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runSqueezeDistortionCorrector(squeezeDistortionCorrectorExample.input),
    ).toEqual({
      ok: true,
      output: squeezeDistortionCorrectorExample.output,
    });
  });

  it("leaves dimensions unchanged at zero distortion", () => {
    const result = runSqueezeDistortionCorrector({
      squeezeWidthCm: 20,
      squeezeHeightCm: 30,
      distortionPercent: 0,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.correctedWidthCm as number).toBe(20);
    expect(result.output.correctedHeightCm as number).toBe(30);
  });

  it("shrinks an expanded squeeze back toward stone dimensions", () => {
    const result = runSqueezeDistortionCorrector({
      squeezeWidthCm: 110,
      squeezeHeightCm: 220,
      distortionPercent: 10,
      mode: "expansion",
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.correctedWidthCm as number).toBeCloseTo(100, 10);
    expect(result.output.correctedHeightCm as number).toBeCloseTo(200, 10);
  });

  it("rejects distortion of 100 percent or more", () => {
    expect(
      runSqueezeDistortionCorrector({
        squeezeWidthCm: 20,
        squeezeHeightCm: 30,
        distortionPercent: 100,
      }).ok,
    ).toBe(false);
  });
});
