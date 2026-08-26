import { describe, expect, it } from "vitest";
import {
  runWaypointBearingRhumb,
  waypointBearingRhumbExample,
} from "./tool.js";

describe("Waypoint Rhumb Bearing Calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runWaypointBearingRhumb(waypointBearingRhumbExample.input)).toEqual({
      ok: true,
      output: waypointBearingRhumbExample.output,
    });
  });

  it("returns due north for a meridional leg", () => {
    expect(
      runWaypointBearingRhumb({
        fromLatitudeDeg: 0,
        fromLongitudeDeg: 0,
        toLatitudeDeg: 1,
        toLongitudeDeg: 0,
      }),
    ).toEqual({ ok: true, output: { rhumbBearingDeg: 0 } });
  });

  it("returns due east along the equator", () => {
    expect(
      runWaypointBearingRhumb({
        fromLatitudeDeg: 0,
        fromLongitudeDeg: 0,
        toLatitudeDeg: 0,
        toLongitudeDeg: 1,
      }),
    ).toEqual({ ok: true, output: { rhumbBearingDeg: 90 } });
  });

  it("returns the reciprocal bearing when reversed", () => {
    expect(
      runWaypointBearingRhumb({
        fromLatitudeDeg: 0,
        fromLongitudeDeg: 1,
        toLatitudeDeg: 0,
        toLongitudeDeg: 0,
      }),
    ).toEqual({ ok: true, output: { rhumbBearingDeg: 270 } });
  });

  it("keeps bearings inside [0, 360)", () => {
    const result = runWaypointBearingRhumb(waypointBearingRhumbExample.input);
    if (!result.ok) throw new Error("expected success");
    expect(result.output.rhumbBearingDeg).toBeGreaterThanOrEqual(0);
    expect(result.output.rhumbBearingDeg).toBeLessThan(360);
  });

  it("crosses the antimeridian the short way", () => {
    const result = runWaypointBearingRhumb({
      fromLatitudeDeg: 0,
      fromLongitudeDeg: 179,
      toLatitudeDeg: 0,
      toLongitudeDeg: -179,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.rhumbBearingDeg).toEqual(90);
  });

  it("rejects geographic poles where a rhumb bearing is undefined", () => {
    const result = runWaypointBearingRhumb({
      fromLatitudeDeg: 90,
      fromLongitudeDeg: 180,
      toLatitudeDeg: -90,
      toLongitudeDeg: -180,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]?.code).toBe("polar_position");
  });

  it("reports a structured error for identical positions", () => {
    const result = runWaypointBearingRhumb({
      fromLatitudeDeg: 12.5,
      fromLongitudeDeg: -45.25,
      toLatitudeDeg: 12.5,
      toLongitudeDeg: -45.25,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]?.code).toBe("same_position");
  });

  it("rejects out-of-range coordinates", () => {
    expect(
      runWaypointBearingRhumb({
        fromLatitudeDeg: 91,
        fromLongitudeDeg: 0,
        toLatitudeDeg: 0,
        toLongitudeDeg: 0,
      }).ok,
    ).toBe(false);
    expect(
      runWaypointBearingRhumb({
        fromLatitudeDeg: 0,
        fromLongitudeDeg: 0,
        toLatitudeDeg: 0,
        toLongitudeDeg: 181,
      }).ok,
    ).toBe(false);
  });

  it("rejects non-finite and missing inputs", () => {
    expect(
      runWaypointBearingRhumb({
        fromLatitudeDeg: Number.NaN,
        fromLongitudeDeg: 0,
        toLatitudeDeg: 1,
        toLongitudeDeg: 0,
      }).ok,
    ).toBe(false);
    expect(runWaypointBearingRhumb({ fromLatitudeDeg: 0 }).ok).toBe(false);
  });
});
