import { describe, expect, it } from "vitest";
import { runAntennaEffectiveAperture } from "./tool.js";

describe("Effective Aperture", () => {
  it("calculates a valid result", () =>
    expect(
      runAntennaEffectiveAperture({ wavelengthMeters: 0.125, gainLinear: 10 }),
    ).toEqual({
      ok: true,
      output: { effectiveApertureM2: 0.012433979929054324 },
    }));
  it("handles unity gain at half a meter", () =>
    expect(
      runAntennaEffectiveAperture({ wavelengthMeters: 0.5, gainLinear: 1 }),
    ).toEqual({
      ok: true,
      output: { effectiveApertureM2: 0.25 / (4 * Math.PI) },
    }));
  it("doubles with doubled gain", () =>
    expect(
      runAntennaEffectiveAperture({ wavelengthMeters: 0.125, gainLinear: 20 }),
    ).toEqual({
      ok: true,
      output: { effectiveApertureM2: 2 * 0.012433979929054324 },
    }));
  it("rejects zero wavelength", () =>
    expect(
      runAntennaEffectiveAperture({ wavelengthMeters: 0, gainLinear: 10 }).ok,
    ).toBe(false));
  it("rejects negative wavelength", () =>
    expect(
      runAntennaEffectiveAperture({ wavelengthMeters: -1, gainLinear: 10 }).ok,
    ).toBe(false));
  it("rejects zero gain", () =>
    expect(
      runAntennaEffectiveAperture({ wavelengthMeters: 0.125, gainLinear: 0 })
        .ok,
    ).toBe(false));
  it("rejects negative gain", () =>
    expect(
      runAntennaEffectiveAperture({ wavelengthMeters: 0.125, gainLinear: -10 })
        .ok,
    ).toBe(false));
});
