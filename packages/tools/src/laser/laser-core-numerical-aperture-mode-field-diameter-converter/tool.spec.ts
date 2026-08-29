import { describe, expect, it } from "vitest";
import {
  coreApertureMfd,
  coreApertureMfdExample as example,
  runCoreApertureMfd,
} from "./tool.js";

describe("fiber NA to MFD converter", () => {
  it("reproduces its canonical example exactly", () =>
    expect(runCoreApertureMfd(example.input)).toEqual({
      ok: true,
      output: example.output,
    }));
  it("matches a hand-derived NA and single-mode verdict", () => {
    const out = coreApertureMfd({
      coreRadiusUm: 4.5,
      wavelengthNm: 1550,
      nCore: 1.46,
      nClad: 1.455,
    });
    expect(out.numericalAperture).toBeCloseTo(0.1207, 4);
    expect(out.singleMode).toBe(true);
    expect(out.marcuseApproximationApplicable).toBe(true);
    expect(out.modeFieldDiameterUm).toBeGreaterThan(2 * 4.5);
  });
  it("agrees approximately with the SMF-28 datasheet MFD range", () => {
    const out = coreApertureMfd({
      coreRadiusUm: 4.1,
      wavelengthNm: 1310,
      nCore: 1.4495,
      nClad: 1.444,
    });
    expect(out.modeFieldDiameterUm).toBeGreaterThan(7.5);
    expect(out.modeFieldDiameterUm).toBeLessThan(11);
  });
  it("flags multimode operation above V = 2.405", () => {
    const out = coreApertureMfd({
      coreRadiusUm: 25,
      wavelengthNm: 850,
      nCore: 1.46,
      nClad: 1.45,
    });
    expect(out.vNumber).toBeGreaterThan(2.405);
    expect(out.singleMode).toBe(false);
    expect(out.marcuseApproximationApplicable).toBe(false);
  });
  it("rejects cladding above core and non-positive geometry", () => {
    expect(
      runCoreApertureMfd({
        coreRadiusUm: 4.5,
        wavelengthNm: 1550,
        nCore: 1.45,
        nClad: 1.46,
      }).ok,
    ).toBe(false);
    expect(
      runCoreApertureMfd({
        coreRadiusUm: 0,
        wavelengthNm: 1550,
        nCore: 1.46,
        nClad: 1.455,
      }).ok,
    ).toBe(false);
    expect(
      runCoreApertureMfd({
        coreRadiusUm: 4.5,
        wavelengthNm: Number.NaN,
        nCore: 1.46,
        nClad: 1.455,
      }).ok,
    ).toBe(false);
  });
});
