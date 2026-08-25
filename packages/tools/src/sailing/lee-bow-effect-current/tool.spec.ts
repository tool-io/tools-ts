import { describe, expect, it } from "vitest";
import {
  calculateLeeBowEffectCurrent,
  leeBowEffectCurrentExample,
  runLeeBowEffectCurrent,
} from "./tool.js";

describe("Lee Bow Effect Calculator", () => {
  it("publishes an executable example", () =>
    expect(runLeeBowEffectCurrent(leeBowEffectCurrentExample.input)).toEqual({
      ok: true,
      output: leeBowEffectCurrentExample.output,
    }));

  it.each([
    [60, 0, 2, 2 * Math.cos(60 * (Math.PI / 180))],
    [180, 0, 2, -2],
    [90, 90, 1.5, 1.5],
    [270, 90, 1.5, -1.5],
    [45, 315, 3, -5.51091059616309e-16],
  ] as const)(
    "projects the current onto the desired course",
    (currentSetDeg, desiredCourseDeg, currentKt, expected) => {
      expect(
        calculateLeeBowEffectCurrent({
          currentKt,
          currentSetDeg,
          desiredCourseDeg,
        }),
      ).toEqual({ effectiveGainKt: expected });
    },
  );

  it("returns signed gains across favorable and foul sets", () => {
    expect(
      calculateLeeBowEffectCurrent({
        currentKt: 2,
        currentSetDeg: 0,
        desiredCourseDeg: 0,
      }),
    ).toEqual({ effectiveGainKt: 2 });
    expect(
      calculateLeeBowEffectCurrent({
        currentKt: 2,
        currentSetDeg: 180,
        desiredCourseDeg: 0,
      }),
    ).toEqual({ effectiveGainKt: -2 });
  });

  it("yields zero gain for beams currents", () => {
    const result = calculateLeeBowEffectCurrent({
      currentKt: 4,
      currentSetDeg: 90,
      desiredCourseDeg: 0,
    });
    expect(result!.effectiveGainKt).toBeCloseTo(0, 12);
  });

  it("scales linearly with current strength", () => {
    const weak = calculateLeeBowEffectCurrent({
      currentKt: 1,
      currentSetDeg: 30,
      desiredCourseDeg: 0,
    })!.effectiveGainKt;
    const strong = calculateLeeBowEffectCurrent({
      currentKt: 5,
      currentSetDeg: 30,
      desiredCourseDeg: 0,
    })!.effectiveGainKt;
    expect(strong).toBeCloseTo(weak * 5, 12);
  });

  it.each([
    [-1, 60, 0],
    [-1, 400, 0],
    [1, 0, 361],
    [1, -20, 100],
  ] as const)(
    "rejects out of range sets and courses",
    (currentKt, currentSetDeg, desiredCourseDeg) => {
      if (currentKt < 0) {
        expect(
          runLeeBowEffectCurrent({
            currentKt,
            currentSetDeg,
            desiredCourseDeg,
          }),
        ).toMatchObject({
          error: { issues: [{ code: "invalid_field" }] },
          ok: false,
        });
        return;
      }
      expect(
        calculateLeeBowEffectCurrent({
          currentKt,
          currentSetDeg,
          desiredCourseDeg,
        }),
      ).toBeNull();
      const result = runLeeBowEffectCurrent({
        currentKt,
        currentSetDeg,
        desiredCourseDeg,
      });
      expect(result.ok).toBe(false);
      if (!result.ok)
        expect(result.error.issues[0]?.code).toBe("invalid_field");
    },
  );

  it("rejects unknown fields and null input", () => {
    expect(
      runLeeBowEffectCurrent({
        currentKt: 2,
        currentSetDeg: 60,
        extra: 1,
        desiredCourseDeg: 0,
      }),
    ).toMatchObject({
      error: { issues: [{ code: "unknown_field" }] },
      ok: false,
    });
    expect(runLeeBowEffectCurrent(null as never).ok).toBe(false);
  });
});
