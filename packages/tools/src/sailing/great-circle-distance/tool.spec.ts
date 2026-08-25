import { describe, expect, it } from "vitest";
import { greatCircleDistanceExample, runGreatCircleDistance } from "./tool.js";

describe("Great Circle Distance Calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runGreatCircleDistance(greatCircleDistanceExample.input)).toEqual({
      ok: true,
      output: greatCircleDistanceExample.output,
    });
  });

  it("returns zero for identical points", () => {
    expect(
      runGreatCircleDistance({
        fromLatitudeDeg: 33.75,
        fromLongitudeDeg: -118.2,
        toLatitudeDeg: 33.75,
        toLongitudeDeg: -118.2,
      }),
    ).toEqual({ ok: true, output: { distanceNm: 0 } });
  });

  it("is symmetric between the two endpoints", () => {
    const forward = runGreatCircleDistance(greatCircleDistanceExample.input);
    const reverse = runGreatCircleDistance({
      fromLatitudeDeg: 48.85,
      fromLongitudeDeg: -2.35,
      toLatitudeDeg: 51.5,
      toLongitudeDeg: 0,
    });
    if (!forward.ok || !reverse.ok) throw new Error("expected success");
    expect(reverse.output.distanceNm).toBe(forward.output.distanceNm);
    expect(forward.output.distanceNm).toBeCloseTo(182.95431225315144, 9);
  });

  it("spans about sixty nautical miles per degree at the equator", () => {
    const result = runGreatCircleDistance({
      fromLatitudeDeg: 0,
      fromLongitudeDeg: 0,
      toLatitudeDeg: 0,
      toLongitudeDeg: 1,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.distanceNm).toBeCloseTo(60.04046073261873, 9);
    expect(result.output.distanceNm).toBeCloseTo(60, 1);
  });

  it("matches the quarter meridian for ninety degrees of longitude", () => {
    const result = runGreatCircleDistance({
      fromLatitudeDeg: 0,
      fromLongitudeDeg: 0,
      toLatitudeDeg: 0,
      toLongitudeDeg: 90,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.distanceNm).toBeCloseTo(5403.641465935685, 6);
  });

  it("measures pole to pole along a full meridian", () => {
    const result = runGreatCircleDistance({
      fromLatitudeDeg: 90,
      fromLongitudeDeg: 0,
      toLatitudeDeg: -90,
      toLongitudeDeg: 0,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.distanceNm).toBeCloseTo(10807.282931871372, 6);
  });

  it("rejects out-of-range coordinates", () => {
    expect(
      runGreatCircleDistance({
        fromLatitudeDeg: -91,
        fromLongitudeDeg: 0,
        toLatitudeDeg: 0,
        toLongitudeDeg: 0,
      }).ok,
    ).toBe(false);
    expect(
      runGreatCircleDistance({
        fromLatitudeDeg: 0,
        fromLongitudeDeg: 0,
        toLatitudeDeg: 0,
        toLongitudeDeg: 180.5,
      }).ok,
    ).toBe(false);
  });

  it("rejects non-finite and missing inputs", () => {
    expect(
      runGreatCircleDistance({
        fromLatitudeDeg: Number.POSITIVE_INFINITY,
        fromLongitudeDeg: 0,
        toLatitudeDeg: 1,
        toLongitudeDeg: 0,
      }).ok,
    ).toBe(false);
    expect(
      runGreatCircleDistance({ toLatitudeDeg: 1, toLongitudeDeg: 1 }).ok,
    ).toBe(false);
  });
});
