import { describe, expect, it } from "vitest";
import {
  calculatePositionErrorCircle,
  positionErrorCircleExample,
  runPositionErrorCircle,
} from "./tool.js";

describe("Position Error Circle", () => {
  it("publishes an executable example", () =>
    expect(runPositionErrorCircle(positionErrorCircleExample.input)).toEqual({
      ok: true,
      output: positionErrorCircleExample.output,
    }));

  it.each([
    [57.3, 2, 2],
    [28.65, 4, 2],
    [100, 5.73, 10],
    [50, 0, 0],
    [120, 1, 2.094241],
  ])(
    "scales distance by degrees over fifty seven point three",
    (distanceRunNm, compassErrorDegrees, expected) => {
      const result = calculatePositionErrorCircle({
        compassErrorDegrees,
        distanceRunNm,
      })!;
      expect(result.errorCircleRadiusNm).toBeCloseTo(expected, 5);
    },
  );

  it("defaults the compass error to two degrees", () => {
    expect(runPositionErrorCircle({ distanceRunNm: 57.3 })).toEqual({
      ok: true,
      output: { errorCircleRadiusNm: 2 },
    });
  });

  it("grows linearly with distance run", () => {
    const half = calculatePositionErrorCircle({
      compassErrorDegrees: 3,
      distanceRunNm: 30,
    })!.errorCircleRadiusNm;
    const whole = calculatePositionErrorCircle({
      compassErrorDegrees: 3,
      distanceRunNm: 60,
    })!.errorCircleRadiusNm;
    expect(whole).toBeCloseTo(half * 2, 12);
  });

  it("accepts errors across the full allowed band", () => {
    expect(
      runPositionErrorCircle({
        compassErrorDegrees: 0,
        distanceRunNm: 40,
      }).ok,
    ).toBe(true);
    expect(
      runPositionErrorCircle({
        compassErrorDegrees: 10,
        distanceRunNm: 40,
      }).ok,
    ).toBe(true);
  });

  it.each([[11], [-1]])(
    "rejects compass errors outside zero to ten",
    (compassErrorDegrees) => {
      expect(
        runPositionErrorCircle({ compassErrorDegrees, distanceRunNm: 50 }),
      ).toMatchObject({
        error: { issues: [{ code: "invalid_field" }] },
        ok: false,
      });
    },
  );

  it.each([[0], [-57.3]])("rejects non-positive distances", (distanceRunNm) => {
    expect(calculatePositionErrorCircle({ distanceRunNm })).toBeNull();
    const result = runPositionErrorCircle({ distanceRunNm });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0]?.code).toBe("invalid_distance");
  });

  it("rejects unknown fields and null input", () => {
    expect(
      runPositionErrorCircle({ fix: "gps", distanceRunNm: 50 }),
    ).toMatchObject({
      error: { issues: [{ code: "unknown_field" }] },
      ok: false,
    });
    expect(runPositionErrorCircle(null as never).ok).toBe(false);
  });
});
