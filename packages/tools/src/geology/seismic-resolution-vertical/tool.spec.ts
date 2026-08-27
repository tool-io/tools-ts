import { describe, expect, it } from "vitest";
import {
  calculateSeismicResolutionVertical,
  seismicResolutionVerticalExample,
  runSeismicResolutionVertical,
} from "./tool.js";

describe("geology/seismic-resolution-vertical", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runSeismicResolutionVertical(seismicResolutionVerticalExample.input),
    ).toEqual({ ok: true, output: seismicResolutionVerticalExample.output });
  });

  it("keeps resolution at a quarter of the wavelength", () => {
    const result = calculateSeismicResolutionVertical({
      velocityMPers: 4500,
      frequencyHz: 90,
    });
    expect(result.wavelengthM).toBe(50);
    expect(result.verticalResolutionM).toBe(12.5);
  });

  it("rejects non-positive velocity and frequency", () => {
    expect(
      runSeismicResolutionVertical({ velocityMPers: 0, frequencyHz: 30 }).ok,
    ).toBe(false);
    expect(
      runSeismicResolutionVertical({ velocityMPers: 3000, frequencyHz: -1 }).ok,
    ).toBe(false);
  });
});
