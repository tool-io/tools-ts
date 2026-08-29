import { describe, expect, it } from "vitest";
import {
  ceoOctaveCheck,
  ceoOctaveExample as example,
  runCeoOctave,
} from "./tool.js";

describe("CEO f-to-2f octave check", () => {
  it("reproduces its canonical example exactly", () =>
    expect(runCeoOctave(example.input)).toEqual({
      ok: true,
      output: example.output,
    }));
  it("rejects sub-octave combs such as Ti:sapphire without broadening", () => {
    const out = ceoOctaveCheck({
      shortWavelengthNm: 700,
      longWavelengthNm: 1000,
    });
    expect(out.octaveRatio).toBeCloseTo(1.4285714285714286, 12);
    expect(out.octaveSpanning).toBe(false);
  });
  it("rejects inverted edges and bad wavelengths", () => {
    expect(
      runCeoOctave({ shortWavelengthNm: 1064, longWavelengthNm: 532 }).ok,
    ).toBe(false);
    expect(
      runCeoOctave({ shortWavelengthNm: 0, longWavelengthNm: 1064 }).ok,
    ).toBe(false);
  });
});
