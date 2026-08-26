import { describe, expect, it } from "vitest";
import {
  calculateWilliamsonTurnCourse,
  williamsonTurnCourseExample,
  runWilliamsonTurnCourse,
} from "./tool.js";

describe("Williamson Turn Course", () => {
  it("publishes an executable example", () =>
    expect(runWilliamsonTurnCourse(williamsonTurnCourseExample.input)).toEqual({
      ok: true,
      output: williamsonTurnCourseExample.output,
    }));

  it.each([
    [30, "starboard", 90],
    [30, "port", 330],
    [350, "starboard", 50],
    [0, "starboard", 60],
    [359, "starboard", 59],
    [100, "port", 40],
  ] as const)(
    "offsets sixty degrees toward the turn direction",
    (courseDeg, turnDirection, expected) => {
      expect(
        calculateWilliamsonTurnCourse({ courseDeg, turnDirection }),
      ).toEqual({
        initialTurnHeadingDeg: expected,
        reciprocalCourseDeg: (courseDeg + 180) % 360,
      });
    },
  );

  it("wraps results into the compass circle", () => {
    expect(
      calculateWilliamsonTurnCourse({
        courseDeg: 320,
        turnDirection: "starboard",
      }),
    ).toEqual({ initialTurnHeadingDeg: 20, reciprocalCourseDeg: 140 });
    expect(
      calculateWilliamsonTurnCourse({ courseDeg: 10, turnDirection: "port" }),
    ).toEqual({ initialTurnHeadingDeg: 310, reciprocalCourseDeg: 190 });
  });

  it("reports both the initial turn heading and final reciprocal", () => {
    expect(
      calculateWilliamsonTurnCourse({ courseDeg: 75, turnDirection: "port" }),
    ).toEqual({ initialTurnHeadingDeg: 15, reciprocalCourseDeg: 255 });
  });

  it("accepts the full zero to three sixty boundary", () => {
    expect(
      calculateWilliamsonTurnCourse({ courseDeg: 360, turnDirection: "port" }),
    ).toEqual({ initialTurnHeadingDeg: 300, reciprocalCourseDeg: 180 });
  });

  it.each([[-1], [360.5], [720]])(
    "rejects courses outside zero to three sixty",
    (courseDeg) => {
      expect(
        calculateWilliamsonTurnCourse({
          courseDeg,
          turnDirection: "starboard",
        }),
      ).toBeNull();
      const result = runWilliamsonTurnCourse({
        courseDeg,
        turnDirection: "starboard",
      });
      expect(result.ok).toBe(false);
      if (!result.ok)
        expect(result.error.issues[0]?.code).toBe("invalid_course");
    },
  );

  it("rejects invalid turn directions at the schema level", () => {
    const result = runWilliamsonTurnCourse({
      courseDeg: 30,
      turnDirection: "astern",
    } as never);
    expect(result).toMatchObject({
      error: { issues: [{ code: "invalid_field" }] },
      ok: false,
    });
  });

  it("rejects unknown fields and null input", () => {
    expect(
      runWilliamsonTurnCourse({ courseDeg: 30, heel: 10 } as never),
    ).toMatchObject({
      error: { issues: [{ code: "unknown_field" }] },
      ok: false,
    });
    expect(runWilliamsonTurnCourse(null as never).ok).toBe(false);
  });
});
