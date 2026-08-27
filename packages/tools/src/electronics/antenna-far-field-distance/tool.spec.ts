import { describe, expect, it } from "vitest";
import { runAntennaFarFieldDistance } from "./tool.js";

describe("Far Field Boundary", () => {
  it("calculates a valid result", () =>
    expect(
      runAntennaFarFieldDistance({
        apertureMeters: 0.5,
        wavelengthMeters: 0.06,
      }),
    ).toEqual({
      ok: true,
      output: { farFieldDistanceM: 8.333333333333334 },
    }));
  it("handles a thirty centimeter aperture", () =>
    expect(
      runAntennaFarFieldDistance({
        apertureMeters: 0.3,
        wavelengthMeters: 0.02,
      }),
    ).toEqual({
      ok: true,
      output: { farFieldDistanceM: 9 },
    }));
  it("handles a one meter aperture", () =>
    expect(
      runAntennaFarFieldDistance({ apertureMeters: 1, wavelengthMeters: 0.5 }),
    ).toEqual({
      ok: true,
      output: { farFieldDistanceM: 4 },
    }));
  it("grows with the square of the aperture", () =>
    expect(
      runAntennaFarFieldDistance({ apertureMeters: 2, wavelengthMeters: 0.5 }),
    ).toEqual({
      ok: true,
      output: { farFieldDistanceM: 16 },
    }));
  it("shrinks with shorter wavelengths", () =>
    expect(
      runAntennaFarFieldDistance({
        apertureMeters: 0.5,
        wavelengthMeters: 0.03,
      }),
    ).toEqual({
      ok: true,
      output: { farFieldDistanceM: 16.666666666666668 },
    }));
  it("rejects zero aperture", () =>
    expect(
      runAntennaFarFieldDistance({ apertureMeters: 0, wavelengthMeters: 0.06 })
        .ok,
    ).toBe(false));
  it("rejects negative aperture", () =>
    expect(
      runAntennaFarFieldDistance({
        apertureMeters: -0.5,
        wavelengthMeters: 0.06,
      }).ok,
    ).toBe(false));
  it("rejects zero wavelength", () =>
    expect(
      runAntennaFarFieldDistance({ apertureMeters: 0.5, wavelengthMeters: 0 })
        .ok,
    ).toBe(false));
});
