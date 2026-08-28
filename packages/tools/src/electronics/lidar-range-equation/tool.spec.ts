import { describe, expect, it } from "vitest";
import { lidarRangeEquationExample, runLidarRangeEquation } from "./tool.js";

const outputOf = (input: {
  linkConstantM?: number;
  peakPowerWatts: number;
  reflectivityFraction: number;
}) => {
  const result = runLidarRangeEquation(input);
  if (!result.ok) throw new Error("expected success");
  return result.output as { estimatedRangeMeters: number };
};

describe("Lidar Range Estimate", () => {
  it("reproduces the canonical example", () =>
    expect(runLidarRangeEquation(lidarRangeEquationExample.input)).toEqual({
      ok: true,
      output: { estimatedRangeMeters: 5000 },
    }));

  it("defaults the link constant to one thousand meters", () =>
    expect(
      runLidarRangeEquation({
        peakPowerWatts: 100,
        reflectivityFraction: 0.25,
      }),
    ).toEqual(
      runLidarRangeEquation({
        linkConstantM: 1000,
        peakPowerWatts: 100,
        reflectivityFraction: 0.25,
      }),
    ));

  it("multiplies the constant by the square root of power times reflectivity", () => {
    const { estimatedRangeMeters } = outputOf({
      linkConstantM: 850,
      peakPowerWatts: 40,
      reflectivityFraction: 0.1,
    });
    expect(estimatedRangeMeters).toBeCloseTo(850 * Math.sqrt(4), 12);
  });

  it("doubles range when power quadruples", () => {
    const base = outputOf({
      peakPowerWatts: 10,
      reflectivityFraction: 0.5,
    }).estimatedRangeMeters;
    const boosted = outputOf({
      peakPowerWatts: 40,
      reflectivityFraction: 0.5,
    }).estimatedRangeMeters;
    expect(boosted).toBeCloseTo(base * 2, 12);
  });

  it("scales with the square root of reflectivity", () => {
    const dull = outputOf({
      peakPowerWatts: 10,
      reflectivityFraction: 0.1,
    }).estimatedRangeMeters;
    const bright = outputOf({
      peakPowerWatts: 10,
      reflectivityFraction: 0.4,
    }).estimatedRangeMeters;
    expect(bright).toBeCloseTo(dull * 2, 12);
  });

  it("returns zero range for a zero-reflectivity target", () =>
    expect(
      outputOf({ peakPowerWatts: 50, reflectivityFraction: 0 })
        .estimatedRangeMeters,
    ).toBe(0));

  it("scales linearly with the link constant", () => {
    const base = outputOf({
      peakPowerWatts: 9,
      reflectivityFraction: 1,
    }).estimatedRangeMeters;
    const retuned = outputOf({
      linkConstantM: 2000,
      peakPowerWatts: 9,
      reflectivityFraction: 1,
    }).estimatedRangeMeters;
    expect(retuned).toBeCloseTo(base * 2, 12);
  });

  it("rejects non-positive power or link constant", () => {
    expect(
      runLidarRangeEquation({ peakPowerWatts: 0, reflectivityFraction: 1 }).ok,
    ).toBe(false);
    expect(
      runLidarRangeEquation({
        linkConstantM: -5,
        peakPowerWatts: 10,
        reflectivityFraction: 1,
      }).ok,
    ).toBe(false);
  });

  it("rejects reflectivity outside the unit interval", () => {
    expect(
      runLidarRangeEquation({ peakPowerWatts: 10, reflectivityFraction: 1.2 })
        .ok,
    ).toBe(false);
    expect(
      runLidarRangeEquation({ peakPowerWatts: 10, reflectivityFraction: -0.1 })
        .ok,
    ).toBe(false);
  });
});
