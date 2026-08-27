import { describe, expect, it } from "vitest";
import {
  calculateSeismicResolutionHorizontalFresnelZone,
  seismicResolutionHorizontalFresnelZoneExample,
  runSeismicResolutionHorizontalFresnelZone,
} from "./tool.js";

describe("geology/seismic-resolution-horizontal-fresnel-zone", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runSeismicResolutionHorizontalFresnelZone(
        seismicResolutionHorizontalFresnelZoneExample.input,
      ),
    ).toEqual({
      ok: true,
      output: seismicResolutionHorizontalFresnelZoneExample.output,
    });
  });

  it("shrinks the Fresnel zone with higher frequency and shallower targets", () => {
    const deep = calculateSeismicResolutionHorizontalFresnelZone({
      velocityMPers: 3000,
      dominantFrequencyHz: 30,
      zeroOffsetTimeS: 2.0,
    });
    const highFreq = calculateSeismicResolutionHorizontalFresnelZone({
      velocityMPers: 3000,
      dominantFrequencyHz: 60,
      zeroOffsetTimeS: 1.0,
    });
    expect(deep.fresnelZoneRadiusM).toBeGreaterThan(
      seismicResolutionHorizontalFresnelZoneExample.output.fresnelZoneRadiusM,
    );
    expect(highFreq.fresnelZoneRadiusM * Math.SQRT2).toBeCloseTo(
      seismicResolutionHorizontalFresnelZoneExample.output.fresnelZoneRadiusM,
      12,
    );
  });

  it("rejects non-positive inputs", () => {
    expect(
      runSeismicResolutionHorizontalFresnelZone({
        velocityMPers: 3000,
        dominantFrequencyHz: 0,
        zeroOffsetTimeS: 1.0,
      }).ok,
    ).toBe(false);
    expect(
      runSeismicResolutionHorizontalFresnelZone({
        velocityMPers: 3000,
        dominantFrequencyHz: 30,
        zeroOffsetTimeS: -1,
      }).ok,
    ).toBe(false);
  });
});
