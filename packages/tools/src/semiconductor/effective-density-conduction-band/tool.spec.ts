import { describe, expect, it } from "vitest";
import {
  calculateEffectiveDensityConductionBand,
  effectiveDensityConductionBandExample,
  runEffectiveDensityConductionBand,
} from "./tool.js";

describe("semiconductor effective density conduction band", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runEffectiveDensityConductionBand(
        effectiveDensityConductionBandExample.input,
      ),
    ).toEqual({ ok: true, output: effectiveDensityConductionBandExample.output });
  });

  it("defaults to a unit mass at 300 K", () => {
    expect(calculateEffectiveDensityConductionBand({})).toEqual({
      ncPerCm3: 2.51e19,
    });
  });

  it("scales with the three-halves power of mass and temperature", () => {
    const doubledMass = calculateEffectiveDensityConductionBand({
      massRatioX: 2,
      temperatureK: 300,
    }).ncPerCm3;
    expect(doubledMass / 2.51e19).toBeCloseTo(2 ** 1.5, 12);
  });

  it("rejects non-positive inputs through execution", () => {
    expect(
      runEffectiveDensityConductionBand({ massRatioX: 0, temperatureK: 300 })
        .ok,
    ).toBe(false);
  });
});
