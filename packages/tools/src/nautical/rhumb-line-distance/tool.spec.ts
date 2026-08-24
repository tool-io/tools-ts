import { describe, expect, it } from "vitest";
import {
  rhumbLineDistanceExample as example,
  runRhumbLineDistance,
} from "./tool.js";
describe("rhumb-line distance", () => {
  it("reproduces its example", () =>
    expect(runRhumbLineDistance(example.input)).toEqual({
      ok: true,
      output: example.output,
    }));
  it("uses the shorter antimeridian crossing", () => {
    const result = runRhumbLineDistance({
      fromLatitudeDeg: 0,
      fromLongitudeDeg: 179,
      toLatitudeDeg: 0,
      toLongitudeDeg: -179,
    });
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.output.distanceNm).toBeCloseTo(120.0809, 3);
  });
  it("rejects a geographic pole", () =>
    expect(
      runRhumbLineDistance({
        fromLatitudeDeg: 90,
        fromLongitudeDeg: 0,
        toLatitudeDeg: 0,
        toLongitudeDeg: 0,
      }).ok,
    ).toBe(false));
});
