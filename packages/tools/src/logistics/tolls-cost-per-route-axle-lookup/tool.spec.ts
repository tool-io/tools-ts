import { describe, expect, it } from "vitest";
import {
  calculateTollsCostPerRouteAxleLookup,
  tollsCostPerRouteAxleLookupExample,
  runTollsCostPerRouteAxleLookup,
} from "./tool.js";

describe("tolls-cost-per-route-axle-lookup", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runTollsCostPerRouteAxleLookup(tollsCostPerRouteAxleLookupExample.input),
    ).toEqual({
      ok: true,
      output: tollsCostPerRouteAxleLookupExample.output,
    });
  });

  it("defaults to a single trip", () => {
    expect(
      runTollsCostPerRouteAxleLookup({ axleCount: 2, totalTollCostUsd: 30 }),
    ).toEqual({
      ok: true,
      output: { tollPerAxleTripUsd: 15, tollPerTripUsd: 30 },
    });
  });

  it("rejects zero axles", () => {
    expect(
      runTollsCostPerRouteAxleLookup({ axleCount: 0, totalTollCostUsd: 30 }).ok,
    ).toBe(false);
  });

  it("rejects fractional axle counts and non-finite costs", () => {
    expect(() =>
      calculateTollsCostPerRouteAxleLookup({
        axleCount: 2.5,
        totalTollCostUsd: 30,
      }),
    ).toThrow("Axle count");
    expect(() =>
      calculateTollsCostPerRouteAxleLookup({
        axleCount: 2,
        totalTollCostUsd: Number.POSITIVE_INFINITY,
      }),
    ).toThrow("must be finite");
  });
});
