import { describe, expect, it } from "vitest";
import { fuelAtWaypointExample, runFuelAtWaypoint } from "./tool.js";

describe("fuel at waypoint calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runFuelAtWaypoint(fuelAtWaypointExample.input)).toEqual({
      ok: true,
      output: fuelAtWaypointExample.output,
    });
  });

  it("returns the full load over zero distance", () => {
    expect(
      runFuelAtWaypoint({
        burnRateKgPerNauticalMile: 12,
        distanceNm: 0,
        startFuelKg: 8000,
      }),
    ).toEqual({ ok: true, output: { remainingFuelKg: 8000 } });
  });

  it("allows landing exactly at zero remaining fuel", () => {
    expect(
      runFuelAtWaypoint({
        burnRateKgPerNauticalMile: 24,
        distanceNm: 100,
        startFuelKg: 2400,
      }),
    ).toEqual({ ok: true, output: { remainingFuelKg: 0 } });
  });

  it("rejects an insufficient start with the stable code", () => {
    const result = runFuelAtWaypoint({
      burnRateKgPerNauticalMile: 12,
      distanceNm: 200,
      startFuelKg: 1000,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.issues[0]?.code).toBe("insufficient_fuel");
      expect(result.error.issues[0]?.field).toBe("startFuelKg");
    }
  });

  it("rejects zero starting fuel", () => {
    expect(
      runFuelAtWaypoint({
        burnRateKgPerNauticalMile: 12,
        distanceNm: 100,
        startFuelKg: 0,
      }).ok,
    ).toBe(false);
  });

  it("rejects a negative starting fuel", () => {
    expect(
      runFuelAtWaypoint({
        burnRateKgPerNauticalMile: 12,
        distanceNm: 100,
        startFuelKg: -500,
      }).ok,
    ).toBe(false);
  });

  it("rejects a zero burn rate", () => {
    expect(
      runFuelAtWaypoint({
        burnRateKgPerNauticalMile: 0,
        distanceNm: 100,
        startFuelKg: 5000,
      }).ok,
    ).toBe(false);
  });

  it("rejects a negative distance with the schema code", () => {
    const result = runFuelAtWaypoint({
      burnRateKgPerNauticalMile: 12,
      distanceNm: -10,
      startFuelKg: 5000,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]?.code).toBe("invalid_field");
  });

  it("requires the starting fuel", () => {
    expect(
      runFuelAtWaypoint({
        burnRateKgPerNauticalMile: 12,
        distanceNm: 100,
      }).ok,
    ).toBe(false);
  });

  it("computes a realistic narrowbody leg", () => {
    expect(
      runFuelAtWaypoint({
        burnRateKgPerNauticalMile: 14,
        distanceNm: 350,
        startFuelKg: 11000,
      }),
    ).toEqual({ ok: true, output: { remainingFuelKg: 6100 } });
  });
});
