import { describe, expect, it } from "vitest";
import {
  calculateAndersonTurnCourse,
  andersonTurnCourseExample,
  runAndersonTurnCourse,
} from "./tool.js";

describe("Anderson Turn Course", () => {
  it("publishes an executable example", () =>
    expect(runAndersonTurnCourse(andersonTurnCourseExample.input)).toEqual({
      ok: true,
      output: andersonTurnCourseExample.output,
    }));

  it.each([
    [0, "starboard", 240],
    [0, "port", 120],
    [100, "starboard", 340],
    [100, "port", 220],
    [200, "starboard", 80],
    [359, "port", 119],
  ] as const)(
    "offsets two hundred forty degrees by direction",
    (courseDeg, turnDirection, expected) => {
      expect(calculateAndersonTurnCourse({ courseDeg, turnDirection })).toEqual(
        {
          andersonTurnCourseDeg: expected,
        },
      );
    },
  );

  it("wraps results past north", () => {
    expect(
      calculateAndersonTurnCourse({
        courseDeg: 200,
        turnDirection: "starboard",
      }),
    ).toEqual({ andersonTurnCourseDeg: 80 });
    expect(
      calculateAndersonTurnCourse({ courseDeg: 5, turnDirection: "port" }),
    ).toEqual({ andersonTurnCourseDeg: 125 });
  });

  it("differs from the reciprocal course except at the antipode", () => {
    const result = calculateAndersonTurnCourse({
      courseDeg: 90,
      turnDirection: "starboard",
    })!.andersonTurnCourseDeg;
    expect(result).toBe(330);
  });

  it("accepts the full zero to three sixty boundary", () => {
    expect(
      calculateAndersonTurnCourse({
        courseDeg: 360,
        turnDirection: "starboard",
      }),
    ).toEqual({ andersonTurnCourseDeg: 240 });
    expect(
      calculateAndersonTurnCourse({ courseDeg: 0, turnDirection: "starboard" }),
    ).toEqual({ andersonTurnCourseDeg: 240 });
  });

  it.each([[-0.5], [400]])(
    "rejects courses outside zero to three sixty",
    (courseDeg) => {
      expect(
        calculateAndersonTurnCourse({ courseDeg, turnDirection: "port" }),
      ).toBeNull();
      const result = runAndersonTurnCourse({
        courseDeg,
        turnDirection: "port",
      });
      expect(result.ok).toBe(false);
      if (!result.ok)
        expect(result.error.issues[0]?.code).toBe("invalid_course");
    },
  );

  it("rejects invalid turn directions", () => {
    expect(
      runAndersonTurnCourse({
        courseDeg: 0,
        turnDirection: "ahead",
      } as never),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_field" }] },
      ok: false,
    });
  });

  it("rejects unknown fields", () => {
    const result = runAndersonTurnCourse({
      courseDeg: 10,
      turnDirection: "port",
      wind: 12,
    });
    expect(result).toMatchObject({
      error: { issues: [{ code: "unknown_field", field: "wind" }] },
      ok: false,
    });
  });
});
