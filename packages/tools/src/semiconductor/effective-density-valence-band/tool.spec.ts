import { describe, expect, it } from "vitest";
import {
  calculateEffectiveDensityValenceBand,
  effectiveDensityValenceBandExample,
  runEffectiveDensityValenceBand,
} from "./tool.js";

describe("semiconductor effective density valence band", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runEffectiveDensityValenceBand(
        effectiveDensityValenceBandExample.input,
      ),
    ).toEqual({ ok: true, output: effectiveDensityValenceBandExample.output });
  });

  it("defaults to a unit mass at 300 K", () => {
    expect(calculateEffectiveDensityValenceBand({})).toEqual({
      nvPerCm3: 1.51e19,
    });
  });

  it("rejects non-positive inputs through execution", () => {
    expect(
      runEffectiveDensityValenceBand({ massRatioX: -1, temperatureK: 300 })
        .ok,
    ).toBe(false);
  });
});
