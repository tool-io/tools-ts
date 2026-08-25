import { describe, expect, it } from "vitest";
import { courseOverGroundExample, runCourseOverGround } from "./tool.js";

describe("Course Over Ground Calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runCourseOverGround(courseOverGroundExample.input)).toEqual({
      ok: true,
      output: courseOverGroundExample.output,
    });
  });

  it("keeps the vessel course with no current", () => {
    expect(
      runCourseOverGround({
        currentSetDeg: 90,
        currentSpeedKt: 0,
        vesselCourseDeg: 0,
        vesselSpeedKt: 10,
      }),
    ).toEqual({ ok: true, output: { courseOverGroundDeg: 0 } });
  });

  it("deflects down-current between north and east", () => {
    const result = runCourseOverGround(courseOverGroundExample.input);
    if (!result.ok) throw new Error("expected success");
    expect(result.output.courseOverGroundDeg).toBeGreaterThan(0);
    expect(result.output.courseOverGroundDeg).toBeLessThan(90);
  });

  it("wraps results into the half-open interval [0, 360)", () => {
    const result = runCourseOverGround({
      currentSetDeg: 1,
      currentSpeedKt: 2,
      vesselCourseDeg: 359,
      vesselSpeedKt: 10,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.courseOverGroundDeg).toBeCloseTo(359.333295724717, 9);
    expect(result.output.courseOverGroundDeg).toBeLessThan(360);
  });

  it("reports a structured stationary error when nothing moves", () => {
    const result = runCourseOverGround({
      currentSetDeg: 180,
      currentSpeedKt: 0,
      vesselCourseDeg: 45,
      vesselSpeedKt: 0,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]?.code).toBe("stationary");
  });

  it("rejects a vessel course above 360 degrees", () => {
    expect(
      runCourseOverGround({
        currentSetDeg: 0,
        currentSpeedKt: 0,
        vesselCourseDeg: 361,
        vesselSpeedKt: 1,
      }).ok,
    ).toBe(false);
  });

  it("rejects negative speeds", () => {
    expect(
      runCourseOverGround({
        currentSetDeg: 0,
        currentSpeedKt: -1,
        vesselCourseDeg: 0,
        vesselSpeedKt: 1,
      }).ok,
    ).toBe(false);
  });

  it("rejects non-finite input", () => {
    expect(
      runCourseOverGround({
        currentSetDeg: Number.NaN,
        currentSpeedKt: 0,
        vesselCourseDeg: 0,
        vesselSpeedKt: 1,
      }).ok,
    ).toBe(false);
  });

  it("rejects missing input fields", () => {
    expect(
      runCourseOverGround({ vesselCourseDeg: 10, vesselSpeedKt: 5 }).ok,
    ).toBe(false);
  });
});
