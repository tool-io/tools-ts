import { describe, expect, it } from "vitest";
import {
  calculatePhotodiodeResponsivity,
  photodiodeResponsivityExample,
  runPhotodiodeResponsivity,
} from "./tool.js";

describe("Photodiode Responsivity (Electronics)", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runPhotodiodeResponsivity(photodiodeResponsivityExample.input),
    ).toEqual({
      ok: true,
      output: photodiodeResponsivityExample.output,
    });
  });

  it("scales linearly with quantum efficiency", () => {
    expect(
      calculatePhotodiodeResponsivity({
        quantumEfficiencyPercent: 40,
        wavelengthNm: 1550,
      }).responsivityAPerW,
    ).toBe(0.5);
  });

  it("gives zero responsivity at zero efficiency", () => {
    expect(
      runPhotodiodeResponsivity({
        quantumEfficiencyPercent: 0,
        wavelengthNm: 900,
      }),
    ).toEqual({ ok: true, output: { responsivityAPerW: 0 } });
  });

  it("rejects quantum efficiency above one hundred percent", () => {
    expect(
      runPhotodiodeResponsivity({
        quantumEfficiencyPercent: 120,
        wavelengthNm: 900,
      }),
    ).toMatchObject({
      error: {
        issues: [{ code: "invalid_field", field: "quantumEfficiencyPercent" }],
      },
      ok: false,
    });
  });

  it("rejects negative quantum efficiency via invalid_efficiency", () => {
    expect(() =>
      calculatePhotodiodeResponsivity({
        quantumEfficiencyPercent: -5,
        wavelengthNm: 900,
      }),
    ).toThrow();
  });

  it("rejects a wavelength of exactly 100 nm via invalid_wavelength", () => {
    expect(
      runPhotodiodeResponsivity({
        quantumEfficiencyPercent: 50,
        wavelengthNm: 100,
      }),
    ).toMatchObject({
      error: {
        issues: [{ code: "invalid_wavelength", field: "wavelengthNm" }],
      },
      ok: false,
    });
  });

  it("rejects a wavelength of exactly 2000 nm via invalid_wavelength", () => {
    expect(
      runPhotodiodeResponsivity({
        quantumEfficiencyPercent: 50,
        wavelengthNm: 2000,
      }),
    ).toMatchObject({
      error: {
        issues: [{ code: "invalid_wavelength", field: "wavelengthNm" }],
      },
      ok: false,
    });
  });

  it("rejects missing required inputs", () => {
    expect(runPhotodiodeResponsivity({ wavelengthNm: 900 })).toMatchObject({
      error: {
        issues: [{ code: "invalid_field", field: "quantumEfficiencyPercent" }],
      },
      ok: false,
    });
  });
});
