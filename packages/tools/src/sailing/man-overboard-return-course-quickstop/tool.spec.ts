import { describe, expect, it } from "vitest";
import {
  calculateQuickstopReturnCourse,
  quickstopReturnCourseExample,
  runQuickstopReturnCourse,
} from "./tool.js";

describe("Quickstop Return Course", () => {
  it("publishes an executable example", () =>
    expect(
      runQuickstopReturnCourse(quickstopReturnCourseExample.input),
    ).toEqual({
      ok: true,
      output: quickstopReturnCourseExample.output,
    }));

  it.each([
    [90, 270],
    [350, 170],
    [0, 180],
    [180, 0],
    [200, 20],
    [45, 225],
    [210, 30],
  ])("calculates the reciprocal course", (courseDeg, expected) => {
    expect(calculateQuickstopReturnCourse({ courseDeg })).toEqual({
      returnCourseDeg: expected,
    });
  });

  it("wraps courses past north", () => {
    expect(calculateQuickstopReturnCourse({ courseDeg: 300 })).toEqual({
      returnCourseDeg: 120,
    });
    expect(calculateQuickstopReturnCourse({ courseDeg: 360 })).toEqual({
      returnCourseDeg: 180,
    });
  });

  it("accepts the full zero to three sixty boundary", () => {
    expect(calculateQuickstopReturnCourse({ courseDeg: 0 })).not.toBeNull();
    expect(calculateQuickstopReturnCourse({ courseDeg: 360 })).not.toBeNull();
  });

  it.each([[-0.1], [-90], [360.5], [720]])(
    "rejects courses outside zero to three sixty",
    (courseDeg) => {
      expect(calculateQuickstopReturnCourse({ courseDeg })).toBeNull();
      const result = runQuickstopReturnCourse({ courseDeg });
      expect(result.ok).toBe(false);
      if (!result.ok)
        expect(result.error.issues[0]?.code).toBe("invalid_course");
    },
  );

  it("rejects non-finite courses at the schema level", () => {
    expect(runQuickstopReturnCourse({ courseDeg: Number.NaN }).ok).toBe(false);
  });

  it("rejects unknown input fields", () => {
    const result = runQuickstopReturnCourse({ courseDeg: 90, tack: "port" });
    expect(result).toMatchObject({
      error: { issues: [{ code: "unknown_field" }] },
      ok: false,
    });
  });
});
