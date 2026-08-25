import { describe, expect, it } from "vitest";
import {
  courseToSteerCurrentExample,
  runCourseToSteerCurrent,
} from "./tool.js";

describe("course to steer current calculator", () => {
  it("reproduces its canonical example exactly", () => {
    const r = runCourseToSteerCurrent(courseToSteerCurrentExample.input);
    if (!r.ok) throw new Error("expected success");
    expect(r.output.courseToSteerDeg).toBeCloseTo(340.5287793655093, 9);
  });

  it("returns the track when there is no current", () => {
    const r = runCourseToSteerCurrent({
      boatSpeedKt: 6,
      currentDriftKt: 0,
      currentSetDeg: 90,
      desiredTrackDeg: 45,
    });
    if (!r.ok) throw new Error("expected success");
    expect(r.output.courseToSteerDeg).toBe(45);
  });
});
