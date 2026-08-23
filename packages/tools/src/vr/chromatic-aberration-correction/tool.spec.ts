import { describe, expect, it } from "vitest";
import { runChromaticAberrationCorrection } from "./tool.js";

describe("Chromatic Aberration Correction Calculator", () => {
  it("calculates a valid result", () => {
    expect(
      runChromaticAberrationCorrection({
        referenceRadiusPx: 500,
        separationPx: 5,
      }),
    ).toEqual({
      ok: true,
      output: { scaleCorrection: 0.01 },
    });
  });

  it("rejects invalid input", () =>
    expect(runChromaticAberrationCorrection(null).ok).toBe(false));

  it("rejects a zero reference radius", () => {
    expect(
      runChromaticAberrationCorrection({
        referenceRadiusPx: 0,
        separationPx: 5,
      }).ok,
    ).toBe(false);
  });
});
