import { describe, expect, it } from "vitest";
import {
  hhgCutoff,
  hhgCutoffExample as example,
  runHhgCutoff,
} from "./tool.js";

describe("HHG cutoff law", () => {
  it("reproduces its canonical example exactly", () =>
    expect(runHhgCutoff(example.input)).toEqual({
      ok: true,
      output: example.output,
    }));
  it("scales Up linearly with intensity and quadratically with wavelength", () => {
    const base = hhgCutoff({
      ionizationPotentialEv: 15.76,
      intensityWPerCm2: 1e14,
      wavelengthUm: 0.8,
    });
    expect(base.ponderomotiveEnergyEv).toBeCloseTo(5.9712, 4);
    const doubledI = hhgCutoff({
      ionizationPotentialEv: 15.76,
      intensityWPerCm2: 2e14,
      wavelengthUm: 0.8,
    });
    expect(doubledI.ponderomotiveEnergyEv).toBeCloseTo(
      base.ponderomotiveEnergyEv * 2,
      10,
    );
    const doubledLambda = hhgCutoff({
      ionizationPotentialEv: 15.76,
      intensityWPerCm2: 1e14,
      wavelengthUm: 1.6,
    });
    expect(doubledLambda.ponderomotiveEnergyEv).toBeCloseTo(
      base.ponderomotiveEnergyEv * 4,
      10,
    );
  });
  it("rejects non-positive Ip, intensity, and wavelength", () => {
    expect(
      runHhgCutoff({
        ionizationPotentialEv: 0,
        intensityWPerCm2: 1e14,
        wavelengthUm: 0.8,
      }).ok,
    ).toBe(false);
    expect(
      runHhgCutoff({
        ionizationPotentialEv: 15.76,
        intensityWPerCm2: -1,
        wavelengthUm: 0.8,
      }).ok,
    ).toBe(false);
    expect(
      runHhgCutoff({
        ionizationPotentialEv: 15.76,
        intensityWPerCm2: 1e14,
        wavelengthUm: Number.NaN,
      }).ok,
    ).toBe(false);
  });
});
