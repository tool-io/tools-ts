import { describe, expect, it } from "vitest";
import {
  rayleighRange,
  rayleighRangeExample as example,
  runRayleighRange,
} from "./tool.js";

describe("Rayleigh range formula", () => {
  it("reproduces its canonical example exactly", () =>
    expect(runRayleighRange(example.input)).toEqual({
      ok: true,
      output: example.output,
    }));
  it("scales quadratically with waist and inversely with wavelength", () => {
    const base = rayleighRange({ waistRadiusUm: 100, wavelengthNm: 1064 });
    const doubled = rayleighRange({ waistRadiusUm: 200, wavelengthNm: 1064 });
    expect(doubled.rayleighRangeMm).toBeCloseTo(base.rayleighRangeMm * 4, 9);
    expect(doubled.confocalParameterMm).toBe(doubled.rayleighRangeMm * 2);
    const halvedLambda = rayleighRange({
      waistRadiusUm: 100,
      wavelengthNm: 532,
    });
    expect(halvedLambda.rayleighRangeMm).toBeCloseTo(
      base.rayleighRangeMm * 2,
      9,
    );
  });
  it("rejects non-positive waist and wavelength", () => {
    expect(runRayleighRange({ waistRadiusUm: 0, wavelengthNm: 1064 }).ok).toBe(
      false,
    );
    expect(runRayleighRange({ waistRadiusUm: 100, wavelengthNm: -1 }).ok).toBe(
      false,
    );
  });
});
