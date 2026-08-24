import { describe, expect, it } from "vitest";
import {
  calculateStopsPerHourRouteDensity,
  stopsPerHourRouteDensityExample,
  runStopsPerHourRouteDensity,
} from "./tool.js";

describe("stops-per-hour-route-density", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runStopsPerHourRouteDensity(stopsPerHourRouteDensityExample.input),
    ).toEqual({
      ok: true,
      output: stopsPerHourRouteDensityExample.output,
    });
  });

  it("handles fractional stop rates", () => {
    expect(
      runStopsPerHourRouteDensity({
        routeDurationHours: 8,
        stopsCompleted: 30,
      }),
    ).toEqual({ ok: true, output: { stopsPerHour: 3.75 } });
  });

  it("rejects zero route duration", () => {
    const result = runStopsPerHourRouteDensity({
      routeDurationHours: 0,
      stopsCompleted: 10,
    });
    expect(result.ok).toBe(false);
    if (result.ok) throw new Error("expected failure");
    expect(result.error.issues[0]).toMatchObject({
      code: "invalid_field",
      field: "routeDurationHours",
    });
  });

  it("rejects invalid counts and overflowing route density", () => {
    expect(() =>
      calculateStopsPerHourRouteDensity({
        routeDurationHours: 1,
        stopsCompleted: 1.5,
      }),
    ).toThrow("safe integer");
    expect(() =>
      calculateStopsPerHourRouteDensity({
        routeDurationHours: Number.MIN_VALUE,
        stopsCompleted: Number.MAX_SAFE_INTEGER,
      }),
    ).toThrow("too large to represent");
  });
});
