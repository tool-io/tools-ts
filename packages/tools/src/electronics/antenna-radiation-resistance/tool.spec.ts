import { describe, expect, it } from "vitest";
import { runAntennaRadiationResistance } from "./tool.js";
describe("Short Dipole Rrad", () => {
  it("calculates resistance for a one-meter dipole at one hundred meters", () =>
    expect(
      runAntennaRadiationResistance({
        lengthMeters: 1,
        wavelengthMeters: 100,
      }),
    ).toEqual({
      ok: true,
      output: { radiationResistanceOhms: 0.07895683520871487 },
    }));
  it("calculates resistance for a half-wave length", () =>
    expect(
      runAntennaRadiationResistance({
        lengthMeters: 0.5,
        wavelengthMeters: 1,
      }),
    ).toEqual({
      ok: true,
      output: { radiationResistanceOhms: 197.39208802178717 },
    }));
  it("quadruples when the electrical length doubles", () =>
    expect(
      runAntennaRadiationResistance({ lengthMeters: 2, wavelengthMeters: 100 }),
    ).toEqual({
      ok: true,
      output: { radiationResistanceOhms: 0.31582734083485947 },
    }));
  it("rejects a zero length", () =>
    expect(
      runAntennaRadiationResistance({ lengthMeters: 0, wavelengthMeters: 10 })
        .ok,
    ).toBe(false));
  it("rejects a negative length", () =>
    expect(
      runAntennaRadiationResistance({ lengthMeters: -1, wavelengthMeters: 10 })
        .ok,
    ).toBe(false));
  it("rejects a zero wavelength", () =>
    expect(
      runAntennaRadiationResistance({ lengthMeters: 1, wavelengthMeters: 0 })
        .ok,
    ).toBe(false));
});
