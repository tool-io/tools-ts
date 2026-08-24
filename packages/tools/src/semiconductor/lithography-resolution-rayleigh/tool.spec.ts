import { describe, expect, it } from "vitest";
import { rayleighResolutionExample, runRayleighResolution } from "./tool.js";

describe("Rayleigh Resolution Calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runRayleighResolution(rayleighResolutionExample.input)).toEqual({
      ok: true,
      output: rayleighResolutionExample.output,
    });
  });

  it("improves inversely with numerical aperture", () => {
    const atOne = runRayleighResolution({
      k1Factor: 0.4,
      numericalAperture: 1,
      wavelengthNm: 193,
    });
    const atTwo = runRayleighResolution({
      k1Factor: 0.4,
      numericalAperture: 2,
      wavelengthNm: 193,
    });
    expect(atOne.ok && atTwo.ok).toBe(true);
    if (atOne.ok && atTwo.ok)
      expect(atTwo.output.resolutionNm).toBe(atOne.output.resolutionNm / 2);
  });

  it("supports immersion numerical apertures above one", () => {
    expect(
      runRayleighResolution({
        k1Factor: 0.4,
        numericalAperture: 1.35,
        wavelengthNm: 193,
      }).ok,
    ).toBe(true);
  });

  it("requires positive wavelength, aperture, and process factor", () => {
    for (const input of [
      { k1Factor: 0.4, numericalAperture: 0, wavelengthNm: 193 },
      { k1Factor: 0, numericalAperture: 0.75, wavelengthNm: 193 },
      { k1Factor: 0.4, numericalAperture: 0.75, wavelengthNm: 0 },
      { numericalAperture: 0.75, wavelengthNm: 193 },
    ])
      expect(runRayleighResolution(input).ok).toBe(false);
  });
});
