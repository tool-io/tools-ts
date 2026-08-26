import { describe, expect, it } from "vitest";
import {
  runSetAndDriftCorrection,
  setAndDriftCorrectionExample,
} from "./tool.js";

describe("set and drift correction calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runSetAndDriftCorrection(setAndDriftCorrectionExample.input),
    ).toEqual({
      ok: true,
      output: setAndDriftCorrectionExample.output,
    });
  });

  it("reports zero drift when on the intended track", () => {
    const r = runSetAndDriftCorrection({
      actualCourseOverGroundDeg: 0,
      distanceRunNm: 10,
      elapsedHours: 2,
      intendedCourseDeg: 0,
      speedThroughWaterKt: 5,
    });
    if (!r.ok) throw new Error("expected success");
    expect(r.output.driftKt).toBeCloseTo(0, 9);
    expect(r.output.setDeg).toBe(0);
  });

  it("derives an easterly cross-current from the velocity vectors", () => {
    const r = runSetAndDriftCorrection({
      actualCourseOverGroundDeg: 21.80140948635181,
      distanceRunNm: Math.sqrt(29),
      elapsedHours: 1,
      intendedCourseDeg: 0,
      speedThroughWaterKt: 5,
    });
    if (!r.ok) throw new Error("expected success");
    expect(r.output.setDeg).toBeCloseTo(90, 9);
    expect(r.output.driftKt).toBeCloseTo(2, 9);
  });

  it("rejects invalid courses and non-finite values", () => {
    expect(
      runSetAndDriftCorrection({
        actualCourseOverGroundDeg: 361,
        distanceRunNm: 10,
        elapsedHours: 1,
        intendedCourseDeg: 0,
        speedThroughWaterKt: 5,
      }).ok,
    ).toBe(false);
    expect(
      runSetAndDriftCorrection({
        actualCourseOverGroundDeg: 0,
        distanceRunNm: 10,
        elapsedHours: 1,
        intendedCourseDeg: 0,
        speedThroughWaterKt: Number.NaN,
      }).ok,
    ).toBe(false);
  });
});
