import { describe, expect, it } from "vitest";
import { runDistortionCorrectionFactor } from "./tool.js";

describe("Distortion Correction Factor Calculator", () => {
  it("calculates a valid result", () => {
    expect(
      runDistortionCorrectionFactor({ k1: -0.2, k2: 0.1, radius: 0.5 }),
    ).toEqual({
      ok: true,
      output: { correctionFactor: expect.closeTo(0.95625, 12) },
    });
  });

  it("returns one at the optical center", () => {
    expect(
      runDistortionCorrectionFactor({ k1: -0.4, k2: 0.3, radius: 0 }),
    ).toEqual({
      ok: true,
      output: { correctionFactor: 1 },
    });
  });

  it("rejects invalid input", () =>
    expect(runDistortionCorrectionFactor(null).ok).toBe(false));

  it("rejects radii outside the normalized range", () => {
    expect(
      runDistortionCorrectionFactor({ k1: 0, k2: 0, radius: 1.1 }).ok,
    ).toBe(false);
  });
});
