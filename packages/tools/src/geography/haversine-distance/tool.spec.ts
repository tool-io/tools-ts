import { describe, expect, it } from "vitest";
import {
  haversineDistanceExample,
  calculateHaversineDistance,
  runHaversineDistance,
} from "./tool.js";

describe("geography/haversine-distance", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runHaversineDistance(haversineDistanceExample.input)).toEqual({
      ok: true,
      output: haversineDistanceExample.output,
    });
  });
  it("rejects invalid input (case)", () => {
    expect(
      runHaversineDistance({
        startLatitudeDeg: 90.5,
        startLongitudeDeg: 0,
        endLatitudeDeg: 0,
        endLongitudeDeg: 0,
      }).ok,
    ).toBe(false);
  });
  it("rejects invalid input (case)", () => {
    expect(
      runHaversineDistance({
        startLatitudeDeg: 0,
        startLongitudeDeg: -200,
        endLatitudeDeg: 0,
        endLongitudeDeg: 0,
      }).ok,
    ).toBe(false);
  });
  it("returns zero for identical points", () => {
    const result = runHaversineDistance({
      endLatitudeDeg: 12.5,
      endLongitudeDeg: -70.2,
      startLatitudeDeg: 12.5,
      startLongitudeDeg: -70.2,
    });
    expect(result).toEqual({ ok: true, output: { distanceM: 0 } });
  });

  it("is symmetric", () => {
    const forward = runHaversineDistance(haversineDistanceExample.input);
    const backward = runHaversineDistance({
      endLatitudeDeg: 51.5074,
      endLongitudeDeg: -0.1278,
      startLatitudeDeg: 48.8566,
      startLongitudeDeg: 2.3522,
    });
    expect(backward.ok && forward.ok).toBe(true);
    if (backward.ok && forward.ok)
      expect(backward.output.distanceM).toBe(forward.output.distanceM);
  });
});
