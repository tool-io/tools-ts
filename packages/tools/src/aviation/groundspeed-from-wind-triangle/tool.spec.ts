import { describe, expect, it } from "vitest";
import {
  groundspeedFromWindTriangleExample,
  runGroundspeedFromWindTriangle,
} from "./tool.js";

describe("groundspeed from wind triangle calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runGroundspeedFromWindTriangle(groundspeedFromWindTriangleExample.input),
    ).toEqual({
      ok: true,
      output: groundspeedFromWindTriangleExample.output,
    });
  });

  it("subtracts the wind for a pure headwind", () => {
    expect(
      runGroundspeedFromWindTriangle({
        trueAirspeedKt: 110,
        trueCourseDeg: 360,
        windSpeedKt: 30,
        windFromDeg: 360,
      }),
    ).toEqual({ ok: true, output: { groundSpeedKt: 80 } });
  });

  it("adds the wind for a pure tailwind", () => {
    expect(
      runGroundspeedFromWindTriangle({
        trueAirspeedKt: 110,
        trueCourseDeg: 90,
        windSpeedKt: 30,
        windFromDeg: 270,
      }),
    ).toEqual({ ok: true, output: { groundSpeedKt: 140 } });
  });

  it("matches the vector sum for a perpendicular wind", () => {
    const result = runGroundspeedFromWindTriangle({
      trueAirspeedKt: 100,
      trueCourseDeg: 0,
      windSpeedKt: 25,
      windFromDeg: 90,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.groundSpeedKt).toBeCloseTo(
      Math.sqrt(100 ** 2 + 25 ** 2),
      9,
    );
  });

  it("returns the true airspeed in calm winds", () => {
    expect(
      runGroundspeedFromWindTriangle({
        trueAirspeedKt: 95,
        trueCourseDeg: 180,
        windSpeedKt: 0,
        windFromDeg: 45,
      }),
    ).toEqual({ ok: true, output: { groundSpeedKt: 95 } });
  });

  it("normalizes courses and wind directions internally", () => {
    const base = runGroundspeedFromWindTriangle({
      trueAirspeedKt: 120,
      trueCourseDeg: 90,
      windSpeedKt: 20,
      windFromDeg: 90,
    });
    const shifted = runGroundspeedFromWindTriangle({
      trueAirspeedKt: 120,
      trueCourseDeg: 450,
      windSpeedKt: 20,
      windFromDeg: -270,
    });
    expect(shifted).toEqual(base);
  });

  it("keeps quartering headwinds between TAS minus wind and TAS", () => {
    const result = runGroundspeedFromWindTriangle({
      trueAirspeedKt: 100,
      trueCourseDeg: 0,
      windSpeedKt: 40,
      windFromDeg: 315,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.groundSpeedKt).toBeGreaterThan(60);
    expect(result.output.groundSpeedKt).toBeLessThan(100);
  });

  it("rejects non-positive true airspeed", () => {
    const result = runGroundspeedFromWindTriangle({
      trueAirspeedKt: 0,
      trueCourseDeg: 90,
      windSpeedKt: 20,
      windFromDeg: 90,
    });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0]?.code).toBe("invalid_true_airspeed");
  });

  it("rejects negative wind speeds at the schema boundary", () => {
    expect(
      runGroundspeedFromWindTriangle({
        trueAirspeedKt: 120,
        trueCourseDeg: 90,
        windSpeedKt: -5,
        windFromDeg: 90,
      }),
    ).toMatchObject({ ok: false });
  });

  it("rejects missing inputs", () => {
    expect(
      runGroundspeedFromWindTriangle({
        trueAirspeedKt: 120,
        trueCourseDeg: 90,
        windSpeedKt: 20,
      }),
    ).toMatchObject({ ok: false });
  });
});
