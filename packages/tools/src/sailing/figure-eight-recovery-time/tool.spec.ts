import { describe, expect, it } from "vitest";
import {
  calculateFigureEightRecoveryTime,
  figureEightRecoveryTimeExample,
  runFigureEightRecoveryTime,
} from "./tool.js";

describe("Figure Eight Recovery Time", () => {
  it("publishes an executable example", () =>
    expect(
      runFigureEightRecoveryTime(figureEightRecoveryTimeExample.input),
    ).toEqual({
      ok: true,
      output: figureEightRecoveryTimeExample.output,
    }));

  it.each([
    [0.5, 6, 2, 2 + 10 * Math.PI],
    [1, 6, 2, 2 + 20 * Math.PI],
    [0.25, 3, 4, 4 + 10 * Math.PI],
    [2, 8, 0, 30 * Math.PI],
    [1, 12, 15, 15 + 10 * Math.PI],
  ])(
    "sails two circles plus the approach allowance",
    (circleDiameterNm, boatSpeedKt, approachMinutes, expected) => {
      expect(
        calculateFigureEightRecoveryTime({
          approachMinutes,
          boatSpeedKt,
          circleDiameterNm,
        })?.recoveryTimeMinutes,
      ).toBeCloseTo(expected, 12);
    },
  );

  it("defaults the approach allowance to two minutes", () => {
    expect(
      runFigureEightRecoveryTime({ boatSpeedKt: 6, circleDiameterNm: 0.5 }),
    ).toEqual({
      ok: true,
      output: { recoveryTimeMinutes: 33.415926535897924 },
    });
  });

  it("scales linearly with circle diameter", () => {
    const small = calculateFigureEightRecoveryTime({
      boatSpeedKt: 5,
      circleDiameterNm: 0.2,
    })!.recoveryTimeMinutes;
    const large = calculateFigureEightRecoveryTime({
      boatSpeedKt: 5,
      circleDiameterNm: 0.4,
    })!.recoveryTimeMinutes;
    expect(large - small).toBeCloseTo((0.2 / 5) * 60 * 2 * Math.PI, 12);
  });

  it("halves the circling time when speed doubles", () => {
    const slow = calculateFigureEightRecoveryTime({
      approachMinutes: 0,
      boatSpeedKt: 4,
      circleDiameterNm: 1,
    })!.recoveryTimeMinutes;
    const fast = calculateFigureEightRecoveryTime({
      approachMinutes: 0,
      boatSpeedKt: 8,
      circleDiameterNm: 1,
    })!.recoveryTimeMinutes;
    expect(fast).toBeCloseTo(slow / 2, 12);
  });

  it.each([[16], [-1]])(
    "rejects approach minutes outside zero to fifteen",
    (approachMinutes) => {
      expect(
        runFigureEightRecoveryTime({
          approachMinutes,
          boatSpeedKt: 6,
          circleDiameterNm: 0.5,
        }),
      ).toMatchObject({
        error: { issues: [{ code: "invalid_field" }] },
        ok: false,
      });
    },
  );

  it.each([
    [0, 6],
    [0.5, 0],
    [-1, 6],
    [0.5, -3],
  ])(
    "rejects non-positive diameters and speeds",
    (circleDiameterNm, boatSpeedKt) => {
      expect(
        calculateFigureEightRecoveryTime({ boatSpeedKt, circleDiameterNm }),
      ).toBeNull();
      const result = runFigureEightRecoveryTime({
        boatSpeedKt,
        circleDiameterNm,
      });
      expect(result.ok).toBe(false);
      if (!result.ok)
        expect(result.error.issues[0]?.code).toBe("invalid_value");
    },
  );

  it("rejects unknown fields and null input", () => {
    expect(runFigureEightRecoveryTime({ circles: 2 } as never)).toMatchObject({
      error: { issues: [{ code: "unknown_field" }] },
      ok: false,
    });
    expect(runFigureEightRecoveryTime(null as never).ok).toBe(false);
  });
});
