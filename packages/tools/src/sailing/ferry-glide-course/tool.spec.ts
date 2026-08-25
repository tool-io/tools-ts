import { describe, expect, it } from "vitest";
import {
  calculateFerryGlideCourse,
  ferryGlideCourseExample,
  runFerryGlideCourse,
} from "./tool.js";

describe("Ferry Glide Course", () => {
  it("publishes an executable example", () =>
    expect(runFerryGlideCourse(ferryGlideCourseExample.input)).toEqual({
      ok: true,
      output: ferryGlideCourseExample.output,
    }));

  it.each([
    [90, 4, 2, "from-starboard", 120],
    [90, 4, 2, "from-port", 60],
    [0, 6, 3, "from-starboard", 30],
  ] as const)(
    "corrects by the arcsine drift ratio signed by side",
    (desiredCourseDeg, boatSpeedKt, currentKt, currentSide, expected) => {
      expect(
        calculateFerryGlideCourse({
          boatSpeedKt,
          currentKt,
          currentSide,
          desiredCourseDeg,
        }),
      ).toEqual({ ferryGlideCourseDeg: expected });
    },
  );

  it("rejects equal speeds because no cross-track progress remains", () => {
    expect(
      calculateFerryGlideCourse({
        boatSpeedKt: 3,
        currentKt: 3,
        currentSide: "from-starboard",
        desiredCourseDeg: 0,
      }),
    ).toBeNull();
  });

  it("wraps corrections past north", () => {
    expect(
      calculateFerryGlideCourse({
        boatSpeedKt: 4,
        currentKt: 2,
        currentSide: "from-port",
        desiredCourseDeg: 20,
      }),
    ).toEqual({ ferryGlideCourseDeg: 350 });
  });

  it.each([
    [3, -1],
    [0, 2],
    [-3, 2],
  ])("rejects invalid speeds with not_ferryable", (boatSpeedKt, currentKt) => {
    expect(
      calculateFerryGlideCourse({
        boatSpeedKt,
        currentKt,
        currentSide: "from-starboard",
        desiredCourseDeg: 90,
      }),
    ).toBeNull();
    const result = runFerryGlideCourse({
      boatSpeedKt,
      currentKt,
      currentSide: "from-starboard",
      desiredCourseDeg: 90,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]?.code).toBe("not_ferryable");
  });

  it("needs no correction in slack water", () => {
    expect(
      runFerryGlideCourse({
        boatSpeedKt: 3,
        currentKt: 0,
        currentSide: "from-starboard",
        desiredCourseDeg: 90,
      }),
    ).toEqual({ ok: true, output: { ferryGlideCourseDeg: 90 } });
  });

  it("reports not_ferryable when current exceeds boat speed", () => {
    const result = runFerryGlideCourse({
      boatSpeedKt: 2,
      currentKt: 4,
      currentSide: "from-starboard",
      desiredCourseDeg: 90,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]?.code).toBe("not_ferryable");
  });

  it.each([[-1], [361]])(
    "rejects courses outside zero to three sixty",
    (desiredCourseDeg) => {
      const result = runFerryGlideCourse({
        boatSpeedKt: 4,
        currentKt: 2,
        currentSide: "from-starboard",
        desiredCourseDeg,
      });
      expect(result.ok).toBe(false);
      if (!result.ok)
        expect(result.error.issues[0]?.code).toBe("not_ferryable");
    },
  );

  it("rejects invalid sides and unknown fields at the schema level", () => {
    expect(
      runFerryGlideCourse({
        boatSpeedKt: 4,
        currentKt: 2,
        currentSide: "upstream",
        desiredCourseDeg: 90,
      } as never),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_field" }] },
      ok: false,
    });
    expect(
      runFerryGlideCourse({
        boatSpeedKt: 4,
        currentKt: 2,
        currentSide: "from-port",
        extra: 1,
        desiredCourseDeg: 90,
      }),
    ).toMatchObject({
      error: { issues: [{ code: "unknown_field" }] },
      ok: false,
    });
  });
});
