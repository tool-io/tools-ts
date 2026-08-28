import { describe, expect, it } from "vitest";
import {
  calculateRadarMaxRange,
  radarMaxRangeExample,
  runRadarMaxRange,
} from "./tool.js";

describe("Radar Max Range", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runRadarMaxRange(radarMaxRangeExample.input)).toEqual({
      ok: true,
      output: radarMaxRangeExample.output,
    });
  });

  it("matches the inverted range equation on another operating point", () => {
    expect(
      calculateRadarMaxRange({
        antennaGainLinear: 100,
        minimumDetectablePowerWatts: 1e-10,
        ptxWatts: 1000,
        radarCrossSectionM2: 2,
        wavelengthMeters: 0.02,
      }).maximumRangeMeters,
    ).toBe(
      Math.pow((1000 * 100 ** 2 * 0.02 ** 2 * 2) / (1984.4017 * 1e-10), 0.25),
    );
  });

  it("grows by the fourth root of sixteen when transmit power doubles", () => {
    const low = calculateRadarMaxRange(
      radarMaxRangeExample.input,
    ).maximumRangeMeters;
    const high = calculateRadarMaxRange({
      ...radarMaxRangeExample.input,
      ptxWatts: 200,
    }).maximumRangeMeters;
    expect(high / low).toBeCloseTo(Math.pow(2, 0.25), 12);
  });

  it("shrinks by the same factor when sensitivity doubles", () => {
    const base = calculateRadarMaxRange(
      radarMaxRangeExample.input,
    ).maximumRangeMeters;
    const worse = calculateRadarMaxRange({
      ...radarMaxRangeExample.input,
      minimumDetectablePowerWatts: 2e-12,
    }).maximumRangeMeters;
    expect(worse).toBeCloseTo(base / Math.pow(2, 0.25), 9);
  });

  it("scales with the fourth root of the cross section", () => {
    const result = calculateRadarMaxRange({
      ...radarMaxRangeExample.input,
      radarCrossSectionM2: 16,
    }).maximumRangeMeters;
    expect(result).toBeCloseTo(2 * 259.5094813775928, 9);
  });

  it("rejects non-positive inputs", () => {
    expect(
      runRadarMaxRange({ ...radarMaxRangeExample.input, ptxWatts: 0 }).ok,
    ).toBe(false);
    expect(
      runRadarMaxRange({ ...radarMaxRangeExample.input, antennaGainLinear: 0 })
        .ok,
    ).toBe(false);
    expect(
      runRadarMaxRange({ ...radarMaxRangeExample.input, wavelengthMeters: -1 })
        .ok,
    ).toBe(false);
    expect(
      runRadarMaxRange({
        ...radarMaxRangeExample.input,
        radarCrossSectionM2: 0,
      }).ok,
    ).toBe(false);
    expect(
      runRadarMaxRange({
        ...radarMaxRangeExample.input,
        minimumDetectablePowerWatts: 0,
      }).ok,
    ).toBe(false);
  });
});
