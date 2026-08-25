import { describe, expect, it } from "vitest";
import {
  mycelialGrowthRateRadialMeasurerExample,
  runMycelialGrowthRateRadialMeasurer,
} from "./tool.js";

describe("Radial Growth Rate", () => {
  it("matches the canonical example", () => {
    expect(
      runMycelialGrowthRateRadialMeasurer(
        mycelialGrowthRateRadialMeasurerExample.input,
      ),
    ).toEqual({
      ok: true,
      output: mycelialGrowthRateRadialMeasurerExample.output,
    });
  });
  it("handles fractional rates", () =>
    expect(
      runMycelialGrowthRateRadialMeasurer({
        daysElapsedInt: 2,
        finalRadiusMm: 25,
        initialRadiusMm: 0,
      }),
    ).toEqual({ ok: true, output: { radialGrowthMmPerDay: 12.5 } }));
  it("accepts a single day", () =>
    expect(
      runMycelialGrowthRateRadialMeasurer({
        daysElapsedInt: 1,
        finalRadiusMm: 7,
        initialRadiusMm: 0,
      }),
    ).toEqual({ ok: true, output: { radialGrowthMmPerDay: 7 } }));
  it("allows no radial change", () =>
    expect(
      runMycelialGrowthRateRadialMeasurer({
        daysElapsedInt: 5,
        finalRadiusMm: 5,
        initialRadiusMm: 5,
      }),
    ).toEqual({ ok: true, output: { radialGrowthMmPerDay: 0 } }));
  it("rejects a final radius smaller than the initial radius", () =>
    expect(
      runMycelialGrowthRateRadialMeasurer({
        daysElapsedInt: 5,
        finalRadiusMm: 4,
        initialRadiusMm: 5,
      }).ok,
    ).toBe(false));
  it("rejects zero days", () =>
    expect(
      runMycelialGrowthRateRadialMeasurer({
        daysElapsedInt: 0,
        finalRadiusMm: 10,
        initialRadiusMm: 0,
      }).ok,
    ).toBe(false));
  it("rejects fractional days", () =>
    expect(
      runMycelialGrowthRateRadialMeasurer({
        daysElapsedInt: 2.5,
        finalRadiusMm: 10,
        initialRadiusMm: 0,
      }).ok,
    ).toBe(false));
});
