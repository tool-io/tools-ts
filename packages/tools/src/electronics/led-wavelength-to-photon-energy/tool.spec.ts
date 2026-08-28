import { describe, expect, it } from "vitest";
import {
  calculateLedWavelengthToPhotonEnergy,
  ledWavelengthToPhotonEnergyExample,
  runLedWavelengthToPhotonEnergy,
} from "./tool.js";

describe("led wavelength to photon energy", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runLedWavelengthToPhotonEnergy(ledWavelengthToPhotonEnergyExample.input),
    ).toEqual({ ok: true, output: ledWavelengthToPhotonEnergyExample.output });
  });

  it("places red photons below green photons in energy", () => {
    const red = calculateLedWavelengthToPhotonEnergy({
      wavelengthNm: 632.8,
    }).photonEnergyEv;
    const green = calculateLedWavelengthToPhotonEnergy({
      wavelengthNm: 532,
    }).photonEnergyEv;
    expect(red).toBeCloseTo(1.9592920353982302, 15);
    expect(green).toBeGreaterThan(red);
  });

  it("inverts wavelength so halving doubles the energy", () => {
    const long = calculateLedWavelengthToPhotonEnergy({
      wavelengthNm: 800,
    }).photonEnergyEv;
    expect(
      calculateLedWavelengthToPhotonEnergy({ wavelengthNm: 400 })
        .photonEnergyEv,
    ).toBe(long * 2);
  });

  it("matches the 1239.84 constant across bands", () => {
    for (const wavelengthNm of [265, 850, 1550]) {
      expect(
        calculateLedWavelengthToPhotonEnergy({ wavelengthNm }).photonEnergyEv,
      ).toBe(1239.84 / wavelengthNm);
    }
  });

  it("rejects non-positive wavelengths through execution", () => {
    expect(runLedWavelengthToPhotonEnergy({ wavelengthNm: 0 })).toMatchObject({
      error: {
        issues: [{ code: "invalid_wavelength", field: "wavelengthNm" }],
      },
      ok: false,
    });
    expect(
      runLedWavelengthToPhotonEnergy({ wavelengthNm: -500 }),
    ).toMatchObject({
      error: {
        issues: [{ code: "invalid_wavelength", field: "wavelengthNm" }],
      },
      ok: false,
    });
  });

  it("keeps ultraviolet photons above three electronvolts", () => {
    expect(
      calculateLedWavelengthToPhotonEnergy({ wavelengthNm: 365 })
        .photonEnergyEv,
    ).toBeGreaterThan(3);
    expect(
      calculateLedWavelengthToPhotonEnergy({ wavelengthNm: 365 })
        .photonEnergyEv,
    ).toBeLessThan(4);
  });
});
