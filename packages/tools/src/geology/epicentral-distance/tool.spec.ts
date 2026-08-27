import { describe, expect, it } from "vitest";
import { epicentralDistanceExample, runEpicentralDistance } from "./tool.js";

describe("epicentral-distance", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runEpicentralDistance(epicentralDistanceExample.input)).toEqual({
      ok: true,
      output: epicentralDistanceExample.output,
    });
  });

  it("returns zero distance for coincident points", () => {
    const result = runEpicentralDistance({
      eventLatitudeDegrees: 47.6,
      eventLongitudeDegrees: -122.3,
      stationLatitudeDegrees: 47.6,
      stationLongitudeDegrees: -122.3,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.distanceKilometers).toBe(0);
  });
  it("rejects latitudes beyond the poles", () => {
    expect(
      runEpicentralDistance({
        eventLatitudeDegrees: 91,
        eventLongitudeDegrees: 0,
        stationLatitudeDegrees: 0,
        stationLongitudeDegrees: 0,
      }).ok,
    ).toBe(false);
  });
});
