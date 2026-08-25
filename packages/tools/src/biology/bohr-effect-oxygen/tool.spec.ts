import { describe, expect, it } from "vitest";
import { runBohrEffectOxygen } from "./tool.js";

describe("Bohr Effect Shift", () => {
  it("calculates the default coefficient shift", () =>
    expect(runBohrEffectOxygen({ ph1: 7.4, ph2: 6.8 })).toEqual({
      ok: true,
      output: { p50ShiftLogUnits: 0.28800000000000026 },
    }));
  it("reproduces the default with an explicit coefficient", () => {
    const implicit = runBohrEffectOxygen({ ph1: 7.4, ph2: 6.8 });
    const explicit = runBohrEffectOxygen({
      ph1: 7.4,
      ph2: 6.8,
      phiBohrCoefficient: -0.48,
    });
    expect(explicit).toEqual(implicit);
  });
  it("returns zero when pH is unchanged", () => {
    const result = runBohrEffectOxygen({ ph1: 7.4, ph2: 7.4 });
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.output.p50ShiftLogUnits).toBe(-0);
  });
  it("flips sign with the pH gradient direction", () => {
    const acidified = runBohrEffectOxygen({ ph1: 7.4, ph2: 6.8 });
    const alkalinized = runBohrEffectOxygen({ ph1: 6.8, ph2: 7.4 });
    expect(acidified.ok && alkalinized.ok).toBe(true);
    if (acidified.ok && alkalinized.ok)
      expect(Number(alkalinized.output.p50ShiftLogUnits)).toBe(
        -Number(acidified.output.p50ShiftLogUnits),
      );
  });
  it("honours a custom signed coefficient", () => {
    const result = runBohrEffectOxygen({
      ph1: 7.6,
      ph2: 7.2,
      phiBohrCoefficient: -0.36,
    });
    expect(result.ok).toBe(true);
    if (result.ok)
      expect(result.output.p50ShiftLogUnits).toBeCloseTo(0.144, 12);
  });
  it("accepts boundary pH values of six and eight point five", () => {
    const low = runBohrEffectOxygen({ ph1: 6, ph2: 8.5 });
    expect(low.ok).toBe(true);
    const high = runBohrEffectOxygen({ ph1: 8.5, ph2: 6 });
    expect(high.ok).toBe(true);
  });
  it("rejects pH below six", () =>
    expect(runBohrEffectOxygen({ ph1: 5.9, ph2: 7 }).ok).toBe(false));
  it("rejects pH above eight point five", () =>
    expect(runBohrEffectOxygen({ ph1: 7, ph2: 8.6 }).ok).toBe(false));
});
