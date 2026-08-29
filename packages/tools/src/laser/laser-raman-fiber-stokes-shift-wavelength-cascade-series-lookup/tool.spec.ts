import { describe, expect, it } from "vitest";
import {
  ramanStokesExample as example,
  ramanStokesWavelength,
  runRamanStokes,
} from "./tool.js";

describe("Raman Stokes cascade", () => {
  it("reproduces its canonical example exactly", () =>
    expect(runRamanStokes(example.input)).toEqual({
      ok: true,
      output: example.output,
    }));
  it("places the second 1064 nm Stokes order near 1174 nm", () => {
    const out = ramanStokesWavelength({
      pumpWavelengthNm: 1064,
      stokesOrder: 2,
    });
    expect(out.stokesWavelengthNm).toBeCloseTo(1173.9161135432848, 9);
  });
  it("shifts monotonically to longer wavelength with order", () => {
    const first = ramanStokesWavelength({
      pumpWavelengthNm: 1064,
      stokesOrder: 1,
    }).stokesWavelengthNm;
    const third = ramanStokesWavelength({
      pumpWavelengthNm: 1064,
      stokesOrder: 3,
    }).stokesWavelengthNm;
    expect(third).toBeGreaterThan(first);
    expect(third).toBeCloseTo(1237.8541379695469, 9);
  });
  it("rejects zero order, excessive order, and bad pumps", () => {
    expect(runRamanStokes({ pumpWavelengthNm: 1064, stokesOrder: 0 }).ok).toBe(
      false,
    );
    expect(runRamanStokes({ pumpWavelengthNm: -5, stokesOrder: 1 }).ok).toBe(
      false,
    );
    expect(
      runRamanStokes({ pumpWavelengthNm: 10000, stokesOrder: 10 }).ok,
    ).toBe(false);
  });
});
