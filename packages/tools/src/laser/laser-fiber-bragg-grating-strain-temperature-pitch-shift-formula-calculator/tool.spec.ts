import { describe, expect, it } from "vitest";
import {
  fbgShiftExample as example,
  fbgPitchShift,
  runFbgShift,
} from "./tool.js";

describe("FBG strain-temperature shift", () => {
  it("reproduces its canonical example exactly", () =>
    expect(runFbgShift(example.input)).toEqual({
      ok: true,
      output: example.output,
    }));
  it("combines thermal expansion and thermo-optic shift", () => {
    const out = fbgPitchShift({
      braggWavelengthNm: 1550,
      strainMicrostrain: 0,
      tempChangeC: 1,
    });
    expect(out.wavelengthShiftPm).toBeCloseTo(14.1825, 4);
    expect(out.newWavelengthNm).toBeCloseTo(1550.0141825, 7);
  });
  it("adds strain and temperature contributions linearly", () => {
    const strainOnly = fbgPitchShift({
      braggWavelengthNm: 1550,
      strainMicrostrain: 500,
      tempChangeC: 0,
    }).wavelengthShiftPm;
    const tempOnly = fbgPitchShift({
      braggWavelengthNm: 1550,
      strainMicrostrain: 0,
      tempChangeC: 10,
    }).wavelengthShiftPm;
    const both = fbgPitchShift({
      braggWavelengthNm: 1550,
      strainMicrostrain: 500,
      tempChangeC: 10,
    }).wavelengthShiftPm;
    expect(both).toBeCloseTo(strainOnly + tempOnly, 9);
  });
  it("rejects non-positive wavelength and non-finite loads", () => {
    expect(
      runFbgShift({
        braggWavelengthNm: 0,
        strainMicrostrain: 0,
        tempChangeC: 0,
      }).ok,
    ).toBe(false);
    expect(
      runFbgShift({
        braggWavelengthNm: 1550,
        strainMicrostrain: Number.NaN,
        tempChangeC: 0,
      }).ok,
    ).toBe(false);
  });
});
