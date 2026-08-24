import { describe, expect, it } from "vitest";
import { runTakeoffDistanceRequiredWithSlope } from "./tool.js";
describe("Takeoff Distance With Slope", () => {
  it("lengthens the distance uphill", () =>
    expect(
      runTakeoffDistanceRequiredWithSlope({
        baseDistanceM: 1000,
        slopePercent: 2,
      }),
    ).toEqual({ ok: true, output: { takeoffDistanceMeters: 1200 } }));
  it("shortens the distance downhill", () =>
    expect(
      runTakeoffDistanceRequiredWithSlope({
        baseDistanceM: 1000,
        slopePercent: -2,
      }),
    ).toEqual({ ok: true, output: { takeoffDistanceMeters: 800 } }));
  it("keeps the distance level", () =>
    expect(
      runTakeoffDistanceRequiredWithSlope({
        baseDistanceM: 1000,
        slopePercent: 0,
      }),
    ).toEqual({ ok: true, output: { takeoffDistanceMeters: 1000 } }));
  it("accepts the uphill bound", () =>
    expect(
      runTakeoffDistanceRequiredWithSlope({
        baseDistanceM: 1000,
        slopePercent: 10,
      }),
    ).toEqual({ ok: true, output: { takeoffDistanceMeters: 2000 } }));
  it("rejects a correction that reaches zero distance", () =>
    expect(
      runTakeoffDistanceRequiredWithSlope({
        baseDistanceM: 1000,
        slopePercent: -10,
      }),
    ).toMatchObject({ ok: false }));
  it("handles fractional slopes", () =>
    expect(
      runTakeoffDistanceRequiredWithSlope({
        baseDistanceM: 850,
        slopePercent: 0.5,
      }),
    ).toEqual({ ok: true, output: { takeoffDistanceMeters: 892.5 } }));
  it("accepts a documented custom correction", () =>
    expect(
      runTakeoffDistanceRequiredWithSlope({
        baseDistanceM: 1000,
        distanceChangePercentPerSlopePercent: 5,
        slopePercent: 2,
      }),
    ).toEqual({ ok: true, output: { takeoffDistanceMeters: 1100 } }));
  it("rejects slopes beyond the bounds", () => {
    expect(
      runTakeoffDistanceRequiredWithSlope({
        baseDistanceM: 1000,
        slopePercent: 10.1,
      }).ok,
    ).toBe(false);
    expect(
      runTakeoffDistanceRequiredWithSlope({
        baseDistanceM: 1000,
        slopePercent: -10.1,
      }).ok,
    ).toBe(false);
  });
  it("rejects non-positive base distances", () =>
    expect(
      runTakeoffDistanceRequiredWithSlope({
        baseDistanceM: 0,
        slopePercent: 2,
      }).ok,
    ).toBe(false));
});
