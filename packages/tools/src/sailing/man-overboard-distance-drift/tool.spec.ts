import { describe, expect, it } from "vitest";
import {
  calculateManOverboardDistanceDrift,
  manOverboardDistanceDriftExample,
  runManOverboardDistanceDrift,
} from "./tool.js";

describe("MOB Drift Distance", () => {
  it("publishes an executable example", () =>
    expect(
      runManOverboardDistanceDrift(manOverboardDistanceDriftExample.input),
    ).toEqual({
      ok: true,
      output: manOverboardDistanceDriftExample.output,
    }));

  it.each([
    [30, 2, 20, 0.02, 1.2],
    [60, 1, 0, 0.02, 1],
    [120, 3, 10, 0.02, 6.4],
    [15, 0.5, 40, 0.02, 0.325],
    [0, 2, 20, 0.02, 0],
  ])(
    "combines current set and windage drift",
    (elapsedMinutes, currentKt, windKt, windageFactor, expected) => {
      expect(
        calculateManOverboardDistanceDrift({
          currentKt,
          elapsedMinutes,
          windKt,
          windageFactor,
        }),
      ).toEqual({ driftDistanceNm: expected });
    },
  );

  it("applies the default two percent windage factor", () => {
    expect(
      runManOverboardDistanceDrift({
        currentKt: 2,
        elapsedMinutes: 30,
        windKt: 20,
      }),
    ).toEqual({ ok: true, output: { driftDistanceNm: 1.2 } });
  });

  it("grows linearly with elapsed time", () => {
    const half = calculateManOverboardDistanceDrift({
      currentKt: 2,
      elapsedMinutes: 30,
      windKt: 20,
    })!.driftDistanceNm;
    const whole = calculateManOverboardDistanceDrift({
      currentKt: 2,
      elapsedMinutes: 60,
      windKt: 20,
    })!.driftDistanceNm;
    expect(whole).toBeCloseTo(half * 2, 12);
  });

  it("yields zero drift for calm conditions", () => {
    expect(
      calculateManOverboardDistanceDrift({
        currentKt: 0,
        elapsedMinutes: 45,
        windKt: 0,
      }),
    ).toEqual({ driftDistanceNm: 0 });
  });

  it.each([
    [-30, 2, 20],
    [30, -2, 20],
    [30, 2, -20],
  ])("rejects negative inputs", (elapsedMinutes, currentKt, windKt) => {
    expect(
      calculateManOverboardDistanceDrift({ currentKt, elapsedMinutes, windKt }),
    ).toBeNull();
    expect(
      runManOverboardDistanceDrift({ currentKt, elapsedMinutes, windKt }).ok,
    ).toBe(false);
  });

  it("rejects a negative windage factor", () => {
    expect(
      runManOverboardDistanceDrift({
        currentKt: 2,
        elapsedMinutes: 30,
        windKt: 20,
        windageFactor: -0.01,
      }).ok,
    ).toBe(false);
  });

  it("rejects unknown fields and missing required inputs", () => {
    expect(
      runManOverboardDistanceDrift({
        currentKt: 1,
        elapsedMinutes: 10,
        extra: true,
        windKt: 5,
      }),
    ).toMatchObject({
      error: { issues: [{ code: "unknown_field" }] },
      ok: false,
    });
    expect(
      runManOverboardDistanceDrift({ elapsedMinutes: 10 } as never).ok,
    ).toBe(false);
  });
});
