import { describe, expect, it } from "vitest";
import {
  calculateMosfetBodyEffect,
  mosfetBodyEffectExample,
  runMosfetBodyEffect,
} from "./tool.js";

describe("MOSFET Body-Effect Shift Calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runMosfetBodyEffect(mosfetBodyEffectExample.input)).toEqual({
      ok: true,
      output: mosfetBodyEffectExample.output,
    });
  });

  it("returns zero shift at zero body bias", () => {
    expect(
      calculateMosfetBodyEffect({ bodyBiasV: 0, gammaV05: 0.4, phiF: 0.6 }),
    ).toEqual({ thresholdShiftV: 0 });
  });

  it("allows a zero body-effect coefficient", () => {
    expect(
      calculateMosfetBodyEffect({ bodyBiasV: 1, gammaV05: 0, phiF: 0.6 }),
    ).toEqual({ thresholdShiftV: 0 });
  });

  it("rejects negative bias or coefficient and non-positive Fermi potential", () => {
    for (const input of [
      { bodyBiasV: -1, gammaV05: 0.4, phiF: 0.6 },
      { bodyBiasV: 1, gammaV05: -0.4, phiF: 0.6 },
      { bodyBiasV: 1, gammaV05: 0.4, phiF: 0 },
    ])
      expect(runMosfetBodyEffect(input).ok).toBe(false);
  });
});
