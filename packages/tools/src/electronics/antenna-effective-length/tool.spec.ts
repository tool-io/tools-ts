import { describe, expect, it } from "vitest";
import { runAntennaEffectiveLength } from "./tool.js";
describe("Effective Length Dipole", () => {
  it("divides a two-meter wavelength by pi", () =>
    expect(runAntennaEffectiveLength({ wavelengthMeters: 2 })).toEqual({
      ok: true,
      output: { effectiveLengthMeters: 0.6366197723675814 },
    }));
  it("divides a one-meter wavelength by pi", () =>
    expect(runAntennaEffectiveLength({ wavelengthMeters: 1 })).toEqual({
      ok: true,
      output: { effectiveLengthMeters: 0.3183098861837907 },
    }));
  it("handles fractional wavelengths", () =>
    expect(runAntennaEffectiveLength({ wavelengthMeters: 0.5 })).toEqual({
      ok: true,
      output: { effectiveLengthMeters: 0.15915494309189535 },
    }));
  it("rejects a zero wavelength", () =>
    expect(runAntennaEffectiveLength({ wavelengthMeters: 0 }).ok).toBe(false));
  it("rejects a negative wavelength", () =>
    expect(runAntennaEffectiveLength({ wavelengthMeters: -2 }).ok).toBe(false));
});
