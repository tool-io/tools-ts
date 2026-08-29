import { describe, expect, it } from "vitest";
import {
  heNeCavity,
  heNeCavityExample as example,
  runHeNeCavity,
} from "./tool.js";

describe("HeNe cavity length design", () => {
  it("reproduces its canonical example exactly", () =>
    expect(runHeNeCavity(example.input)).toEqual({
      ok: true,
      output: example.output,
    }));
  it("reaches single-mode spacing for short stabilized tubes", () => {
    const out = heNeCavity({ cavityLengthCm: 5 });
    expect(out.modeSpacingGhz).toBeCloseTo(2.99792458, 8);
    expect(out.modeSpacingCoversGainBandwidth).toBe(true);
    expect(out.maxSpacingCriterionLengthCm).toBeCloseTo(9.993081933333333, 9);
  });
  it("rejects non-positive tube lengths", () =>
    expect(runHeNeCavity({ cavityLengthCm: 0 }).ok).toBe(false));
});
