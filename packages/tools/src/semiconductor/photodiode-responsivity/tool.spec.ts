import { describe, expect, it } from "vitest";
import {
  photodiodeResponsivityExample,
  runPhotodiodeResponsivity,
} from "./tool.js";

describe("Photodiode Responsivity Calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runPhotodiodeResponsivity(photodiodeResponsivityExample.input),
    ).toEqual({
      ok: true,
      output: photodiodeResponsivityExample.output,
    });
  });

  it("gives one ampere per watt at the exact hc/q wavelength and unity efficiency", () => {
    expect(
      runPhotodiodeResponsivity({
        quantumEfficiencyPercent: 100,
        wavelengthNm: 1239.8419843320026,
      }),
    ).toEqual({ ok: true, output: { responsivityAPerW: 1 } });
  });

  it("scales linearly with efficiency and wavelength", () => {
    const one = runPhotodiodeResponsivity({
      quantumEfficiencyPercent: 40,
      wavelengthNm: 500,
    });
    const two = runPhotodiodeResponsivity({
      quantumEfficiencyPercent: 80,
      wavelengthNm: 1000,
    });
    expect(one.ok && two.ok).toBe(true);
    if (one.ok && two.ok)
      expect(two.output.responsivityAPerW).toBe(
        4 * one.output.responsivityAPerW,
      );
  });

  it("allows zero efficiency but requires positive wavelength", () => {
    expect(
      runPhotodiodeResponsivity({
        quantumEfficiencyPercent: 0,
        wavelengthNm: 850,
      }),
    ).toEqual({
      ok: true,
      output: { responsivityAPerW: 0 },
    });
    expect(
      runPhotodiodeResponsivity({
        quantumEfficiencyPercent: 80,
        wavelengthNm: 0,
      }).ok,
    ).toBe(false);
  });
});
