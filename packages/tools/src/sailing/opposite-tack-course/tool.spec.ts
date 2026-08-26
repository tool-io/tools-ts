import { describe, expect, it } from "vitest";
import {
  calculateOppositeTackCourse,
  oppositeTackCourseExample,
  runOppositeTackCourse,
} from "./tool.js";

describe("Opposite Tack Course Calculator", () => {
  it("publishes an executable example", () =>
    expect(runOppositeTackCourse(oppositeTackCourseExample.input)).toEqual({
      ok: true,
      output: oppositeTackCourseExample.output,
    }));

  it.each([
    [40, 0, 320],
    [320, 0, 40],
    [45, 90, 135],
    [135, 90, 45],
    [310, 350, 30],
    [30, 350, 310],
  ])(
    "reflects the course across true wind",
    (courseDeg, trueWindFromDeg, expected) => {
      expect(calculateOppositeTackCourse({ courseDeg, trueWindFromDeg })).toBe(
        expected,
      );
    },
  );

  it("wraps courses past north", () => {
    expect(
      calculateOppositeTackCourse({ courseDeg: 310, trueWindFromDeg: 350 }),
    ).toBe(30);
    expect(
      calculateOppositeTackCourse({ courseDeg: 30, trueWindFromDeg: 10 }),
    ).toBe(350);
  });

  it("treats three hundred sixty degrees as north", () => {
    expect(
      calculateOppositeTackCourse({ courseDeg: 40, trueWindFromDeg: 360 }),
    ).toBe(320);
  });

  it("is an involution around the same wind direction", () => {
    const course = 123;
    const trueWindFromDeg = 17;
    const opposite = calculateOppositeTackCourse({
      courseDeg: course,
      trueWindFromDeg,
    })!;
    expect(
      calculateOppositeTackCourse({
        courseDeg: opposite,
        trueWindFromDeg,
      }),
    ).toBe(course);
  });

  it.each([[-0.1], [-90], [360.5], [720]])(
    "rejects courses outside zero to three sixty",
    (courseDeg) => {
      expect(
        calculateOppositeTackCourse({ courseDeg, trueWindFromDeg: 0 }),
      ).toBeNull();
      const result = runOppositeTackCourse({ courseDeg, trueWindFromDeg: 0 });
      expect(result.ok).toBe(false);
      if (!result.ok)
        expect(result.error.issues[0]?.code).toBe("invalid_course");
    },
  );

  it("rejects non-finite courses", () => {
    expect(
      calculateOppositeTackCourse({
        courseDeg: Number.NaN,
        trueWindFromDeg: 0,
      }),
    ).toBeNull();
    const result = runOppositeTackCourse({
      courseDeg: Number.NaN,
      trueWindFromDeg: 0,
    });
    expect(result.ok).toBe(false);
  });

  it("rejects unknown input fields", () => {
    const result = runOppositeTackCourse({
      courseDeg: 350,
      extra: 1,
      trueWindFromDeg: 0,
    });
    expect(result.ok).toBe(false);
  });
});
