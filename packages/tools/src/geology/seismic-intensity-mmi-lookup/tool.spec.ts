import { describe, expect, it } from "vitest";
import {
  seismicIntensityMmiLookupExample,
  runSeismicIntensityMmiLookup,
} from "./tool.js";

describe("seismic-intensity-mmi-lookup", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runSeismicIntensityMmiLookup(seismicIntensityMmiLookupExample.input),
    ).toEqual({
      ok: true,
      output: seismicIntensityMmiLookupExample.output,
    });
  });

  it("maps level twelve to total damage", () => {
    const result = runSeismicIntensityMmiLookup({ intensityLevel: 12 });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.romanNumeral).toBe("XII");
    expect(result.output.shakingName).toBe("Extreme");
  });
  it("rejects out-of-range levels", () => {
    expect(runSeismicIntensityMmiLookup({ intensityLevel: 13 }).ok).toBe(false);
  });
});
