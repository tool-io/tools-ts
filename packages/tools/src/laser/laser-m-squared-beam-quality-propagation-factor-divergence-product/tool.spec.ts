import { describe, expect, it } from "vitest";
import {
  mSquaredExample as example,
  mSquaredProduct,
  runMSquared,
} from "./tool.js";

describe("M² beam quality product", () => {
  it("reproduces its canonical example exactly", () =>
    expect(runMSquared(example.input)).toEqual({
      ok: true,
      output: example.output,
    }));
  it("returns unity for a diffraction-limited Gaussian", () => {
    const out = mSquaredProduct({
      waistRadiusUm: 100,
      divergenceHalfAngleMrad: 3.183098861837907,
      wavelengthNm: 1000,
    });
    expect(out.mSquared).toBeCloseTo(1, 9);
    expect(out.beamParameterProductMmMrad).toBeCloseTo(0.3183098861837907, 12);
  });
  it("rejects sub-diffraction claims and bad geometry", () => {
    expect(
      runMSquared({
        waistRadiusUm: 10,
        divergenceHalfAngleMrad: 1,
        wavelengthNm: 1064,
      }).ok,
    ).toBe(false);
    expect(
      runMSquared({
        waistRadiusUm: 0,
        divergenceHalfAngleMrad: 10,
        wavelengthNm: 1064,
      }).ok,
    ).toBe(false);
  });
});
