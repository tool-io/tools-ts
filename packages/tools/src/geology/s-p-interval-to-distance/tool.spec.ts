import { describe, expect, it } from "vitest";
import {
  spIntervalToDistanceExample,
  runSPIntervalToDistance,
} from "./tool.js";

describe("s-p-interval-to-distance", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runSPIntervalToDistance(spIntervalToDistanceExample.input)).toEqual({
      ok: true,
      output: spIntervalToDistanceExample.output,
    });
  });

  it("returns zero distance for simultaneous arrivals", () => {
    const result = runSPIntervalToDistance({
      intervalSeconds: 0,
      pVelocityKmPerSecond: 6,
      sVelocityKmPerSecond: 3.5,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.distanceKm).toBe(0);
  });
  it("rejects S waves faster than P waves", () => {
    expect(
      runSPIntervalToDistance({
        intervalSeconds: 1,
        pVelocityKmPerSecond: 3,
        sVelocityKmPerSecond: 4,
      }).ok,
    ).toBe(false);
  });
});
