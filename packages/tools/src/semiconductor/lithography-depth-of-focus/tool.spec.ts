import { describe, expect, it } from "vitest";
import { depthOfFocusExample, runDepthOfFocus } from "./tool.js";

describe("Depth of Focus Calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runDepthOfFocus(depthOfFocusExample.input)).toEqual({
      ok: true,
      output: depthOfFocusExample.output,
    });
  });

  it("falls with the square of numerical aperture", () => {
    const atOne = runDepthOfFocus({
      k2Factor: 0.5,
      numericalAperture: 1,
      wavelengthNm: 193,
    });
    const atTwo = runDepthOfFocus({
      k2Factor: 0.5,
      numericalAperture: 2,
      wavelengthNm: 193,
    });
    expect(atOne.ok && atTwo.ok).toBe(true);
    if (atOne.ok && atTwo.ok)
      expect(atTwo.output.depthOfFocusNm).toBe(atOne.output.depthOfFocusNm / 4);
  });

  it("supports immersion numerical apertures above one", () => {
    expect(
      runDepthOfFocus({
        k2Factor: 0.5,
        numericalAperture: 1.35,
        wavelengthNm: 193,
      }).ok,
    ).toBe(true);
  });

  it("requires positive wavelength, aperture, and process factor", () => {
    for (const input of [
      { k2Factor: 0.5, numericalAperture: 0, wavelengthNm: 193 },
      { k2Factor: 0, numericalAperture: 0.75, wavelengthNm: 193 },
      { k2Factor: 0.5, numericalAperture: 0.75, wavelengthNm: 0 },
      { numericalAperture: 0.75, wavelengthNm: 193 },
    ])
      expect(runDepthOfFocus(input).ok).toBe(false);
  });
});
