import { describe, expect, it } from "vitest";
import { runEstimatedFuelTrip } from "./tool.js";
describe("Estimated Trip Fuel Calculator", () => {
  it("calculates a valid result", () =>
    expect(
      runEstimatedFuelTrip({
        burnRateKgPerHour: 2400,
        distanceNm: 300,
        groundSpeedKt: 120,
      }),
    ).toEqual({ ok: true, output: { tripFuelKg: 6000 } }));
  it("handles shorter legs", () =>
    expect(
      runEstimatedFuelTrip({
        burnRateKgPerHour: 1500,
        distanceNm: 150,
        groundSpeedKt: 100,
      }),
    ).toEqual({ ok: true, output: { tripFuelKg: 2250 } }));
  it("handles fractional results", () => {
    const result = runEstimatedFuelTrip({
      burnRateKgPerHour: 8000,
      distanceNm: 1000,
      groundSpeedKt: 450,
    });
    expect(result.ok).toBe(true);
    if (!result.ok) throw new Error("Expected success.");
    expect(result.output.tripFuelKg).toBeCloseTo(17777.777777777777, 6);
  });
  it("rejects zero distance", () =>
    expect(
      runEstimatedFuelTrip({
        burnRateKgPerHour: 2400,
        distanceNm: 0,
        groundSpeedKt: 120,
      }).ok,
    ).toBe(false));
  it("rejects zero ground speed", () =>
    expect(
      runEstimatedFuelTrip({
        burnRateKgPerHour: 2400,
        distanceNm: 300,
        groundSpeedKt: 0,
      }).ok,
    ).toBe(false));
  it("rejects negative burn rate", () =>
    expect(
      runEstimatedFuelTrip({
        burnRateKgPerHour: -1,
        distanceNm: 300,
        groundSpeedKt: 120,
      }).ok,
    ).toBe(false));
  it("rejects non-finite ground speed", () =>
    expect(
      runEstimatedFuelTrip({
        burnRateKgPerHour: 2400,
        distanceNm: 300,
        groundSpeedKt: Number.POSITIVE_INFINITY,
      }).ok,
    ).toBe(false));
});
