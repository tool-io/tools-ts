import { describe, expect, it } from "vitest";
import { bearingExample, calculateBearing, runBearing } from "./tool.js";

describe("geography/bearing", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runBearing(bearingExample.input)).toEqual({
      ok: true,
      output: bearingExample.output,
    });
  });
  it("rejects invalid input (case)", () => {
    expect(
      runBearing({
        startLatitudeDeg: 0,
        startLongitudeDeg: 0,
        endLatitudeDeg: -91,
        endLongitudeDeg: 0,
      }).ok,
    ).toBe(false);
  });
  it("rejects invalid input (case)", () => {
    expect(
      runBearing({
        startLatitudeDeg: 0,
        startLongitudeDeg: 180.5,
        endLatitudeDeg: 0,
        endLongitudeDeg: 0,
      }).ok,
    ).toBe(false);
  });
  it("reports due east as 90 degrees", () => {
    const result = runBearing({
      endLatitudeDeg: 0,
      endLongitudeDeg: 10,
      startLatitudeDeg: 0,
      startLongitudeDeg: 0,
    });
    expect(result).toEqual({ ok: true, output: { initialBearingDeg: 90 } });
  });

  it("keeps the bearing inside [0, 360)", () => {
    const result = runBearing({
      endLatitudeDeg: -33.8688,
      endLongitudeDeg: 151.2093,
      startLatitudeDeg: 40.7128,
      startLongitudeDeg: -74.006,
    });
    expect(result.ok).toBe(true);
    if (result.ok)
      expect(result.output.initialBearingDeg).toBeGreaterThanOrEqual(0);
  });
});
