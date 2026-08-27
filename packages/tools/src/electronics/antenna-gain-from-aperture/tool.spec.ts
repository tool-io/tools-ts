import { describe, expect, it } from "vitest";
import { runAntennaGainFromAperture } from "./tool.js";

describe("Gain From Aperture", () => {
  it("calculates a valid result with the default efficiency", () =>
    expect(
      runAntennaGainFromAperture({ areaM2: 0.01, wavelengthMeters: 0.03 }),
    ).toEqual({
      ok: true,
      output: { antennaGainLinear: 76.79448708775053 },
    }));
  it("matches an explicit efficiency of 0.55", () =>
    expect(
      runAntennaGainFromAperture({
        areaM2: 0.01,
        wavelengthMeters: 0.03,
        efficiencyFraction: 0.55,
      }),
    ).toEqual({
      ok: true,
      output: { antennaGainLinear: 76.79448708775053 },
    }));
  it("reaches the ideal gain at unity efficiency", () =>
    expect(
      runAntennaGainFromAperture({
        areaM2: 0.01,
        wavelengthMeters: 0.03,
        efficiencyFraction: 1,
      }),
    ).toEqual({
      ok: true,
      output: { antennaGainLinear: (4 * Math.PI * 0.01) / 0.03 ** 2 },
    }));
  it("scales linearly with efficiency", () =>
    expect(
      runAntennaGainFromAperture({
        areaM2: 0.01,
        wavelengthMeters: 0.03,
        efficiencyFraction: 0.5,
      }),
    ).toEqual({
      ok: true,
      output: { antennaGainLinear: 69.81317007977319 },
    }));
  it("rejects zero area", () =>
    expect(
      runAntennaGainFromAperture({ areaM2: 0, wavelengthMeters: 0.03 }).ok,
    ).toBe(false));
  it("rejects zero wavelength", () =>
    expect(
      runAntennaGainFromAperture({ areaM2: 0.01, wavelengthMeters: 0 }).ok,
    ).toBe(false));
  it("rejects zero efficiency", () =>
    expect(
      runAntennaGainFromAperture({
        areaM2: 0.01,
        wavelengthMeters: 0.03,
        efficiencyFraction: 0,
      }).ok,
    ).toBe(false));
  it("rejects efficiency above one", () =>
    expect(
      runAntennaGainFromAperture({
        areaM2: 0.01,
        wavelengthMeters: 0.03,
        efficiencyFraction: 1.1,
      }).ok,
    ).toBe(false));
});
