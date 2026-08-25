import { describe, expect, it } from "vitest";
import { crossTrackErrorExample, runCrossTrackError } from "./tool.js";

describe("Cross Track Error Calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runCrossTrackError(crossTrackErrorExample.input)).toEqual({
      ok: true,
      output: crossTrackErrorExample.output,
    });
  });

  it("reports zero error when exactly on course", () => {
    expect(
      runCrossTrackError({
        bearingFromStartDeg: 42,
        desiredCourseDeg: 42,
        distanceFromStartNm: 25,
      }),
    ).toEqual({ ok: true, output: { crossTrackErrorNm: 0 } });
  });

  it("returns a full distance at a beam bearing", () => {
    expect(
      runCrossTrackError({
        bearingFromStartDeg: 90,
        desiredCourseDeg: 0,
        distanceFromStartNm: 10,
      }),
    ).toEqual({ ok: true, output: { crossTrackErrorNm: 10 } });
  });

  it("is negative when left of course", () => {
    const result = runCrossTrackError({
      bearingFromStartDeg: -15,
      desiredCourseDeg: 0,
      distanceFromStartNm: 10,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.crossTrackErrorNm).toBeLessThan(0);
    expect(result.output.crossTrackErrorNm).toBeCloseTo(-2.5881904510252074, 9);
  });

  it("keeps the signed value without normalizing large bearings", () => {
    const result = runCrossTrackError({
      bearingFromStartDeg: 400,
      desiredCourseDeg: 40,
      distanceFromStartNm: 10,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.crossTrackErrorNm).toBeCloseTo(
      -2.4492935982947065e-15,
      12,
    );
  });

  it("returns zero error at the start", () => {
    const result = runCrossTrackError({
      bearingFromStartDeg: 0,
      desiredCourseDeg: 0,
      distanceFromStartNm: 0,
    });
    expect(result).toEqual({ ok: true, output: { crossTrackErrorNm: 0 } });
  });

  it("rejects negative distances", () => {
    expect(
      runCrossTrackError({
        bearingFromStartDeg: 0,
        desiredCourseDeg: 0,
        distanceFromStartNm: -5,
      }).ok,
    ).toBe(false);
  });

  it("rejects non-finite bearings", () => {
    expect(
      runCrossTrackError({
        bearingFromStartDeg: Number.NaN,
        desiredCourseDeg: 0,
        distanceFromStartNm: 1,
      }).ok,
    ).toBe(false);
  });

  it("rejects missing input fields", () => {
    expect(runCrossTrackError({ distanceFromStartNm: 5 }).ok).toBe(false);
  });
});
