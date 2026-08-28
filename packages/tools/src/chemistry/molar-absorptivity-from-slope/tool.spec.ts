import { describe, expect, it } from "vitest";
import { runMolarAbsorptivityFromSlope } from "./tool.js";

describe("Molar Absorptivity From Slope Calculator", () => {
  it("calculates a valid result", () => {
    expect(
      runMolarAbsorptivityFromSlope({
        calibrationSlope: 5000,
        pathLengthCm: 1,
      }),
    ).toEqual({ ok: true, output: { molarAbsorptivity: 5000 } });
  });

  it("rejects invalid input", () =>
    expect(runMolarAbsorptivityFromSlope(null).ok).toBe(false));
});
