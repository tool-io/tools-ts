import { describe, expect, it } from "vitest";
import { runAntennaNearFieldDistance } from "./tool.js";

describe("Near Field Distance", () => {
  it("calculates a valid result", () =>
    expect(
      runAntennaNearFieldDistance({
        dishDiameterMeters: 0.45,
        wavelengthMeters: 0.03,
      }),
    ).toEqual({
      ok: true,
      output: { nearFieldDistanceM: 1.0805623535918694 },
    }));
  it("handles a sixty centimeter dish at four centimeters", () =>
    expect(
      runAntennaNearFieldDistance({
        dishDiameterMeters: 0.6,
        wavelengthMeters: 0.04,
      }),
    ).toEqual({
      ok: true,
      output: { nearFieldDistanceM: 1.4407498047891591 },
    }));
  it("handles a one meter dish at ten centimeters", () =>
    expect(
      runAntennaNearFieldDistance({
        dishDiameterMeters: 1,
        wavelengthMeters: 0.1,
      }),
    ).toEqual({
      ok: true,
      output: { nearFieldDistanceM: 1.9606121493043953 },
    }));
  it("grows with diameter to the three-halves power", () =>
    expect(
      runAntennaNearFieldDistance({
        dishDiameterMeters: 2,
        wavelengthMeters: 0.1,
      }),
    ).toEqual({
      ok: true,
      output: { nearFieldDistanceM: 5.5454485841994785 },
    }));
  it("grows with shorter wavelengths", () =>
    expect(
      runAntennaNearFieldDistance({
        dishDiameterMeters: 1,
        wavelengthMeters: 0.05,
      }),
    ).toEqual({
      ok: true,
      output: { nearFieldDistanceM: 2.7727242920997393 },
    }));
  it("rejects zero diameter", () =>
    expect(
      runAntennaNearFieldDistance({
        dishDiameterMeters: 0,
        wavelengthMeters: 0.03,
      }).ok,
    ).toBe(false));
  it("rejects negative diameter", () =>
    expect(
      runAntennaNearFieldDistance({
        dishDiameterMeters: -0.45,
        wavelengthMeters: 0.03,
      }).ok,
    ).toBe(false));
  it("rejects zero wavelength", () =>
    expect(
      runAntennaNearFieldDistance({
        dishDiameterMeters: 0.45,
        wavelengthMeters: 0,
      }).ok,
    ).toBe(false));
});
