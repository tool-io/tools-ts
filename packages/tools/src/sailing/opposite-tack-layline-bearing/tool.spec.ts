import { describe, expect, it } from "vitest";
import {
  calculateOppositeTackLaylineBearing,
  oppositeTackLaylineBearingExample,
  runOppositeTackLaylineBearing,
} from "./tool.js";

describe("Opposite Tack Layline Bearing", () => {
  it("publishes an executable example", () =>
    expect(
      runOppositeTackLaylineBearing(oppositeTackLaylineBearingExample.input),
    ).toEqual({
      ok: true,
      output: oppositeTackLaylineBearingExample.output,
    }));

  it.each([
    [0, "right", 45, 45],
    [0, "left", 45, 315],
    [350, "left", 45, 305],
    [350, "right", 45, 35],
    [180, "right", 30, 210],
    [90, "left", 89, 1],
  ] as const)(
    "offsets the wind direction by the tacking angle per side",
    (trueWindFromDeg, laylineSide, closeHauledAngleDeg, expected) => {
      expect(
        calculateOppositeTackLaylineBearing({
          laylineSide,
          closeHauledAngleDeg,
          trueWindFromDeg,
        }),
      ).toEqual({ oppositeLaylineBearingDeg: expected });
    },
  );

  it("defaults the close-hauled angle to forty five degrees", () => {
    expect(
      runOppositeTackLaylineBearing({
        laylineSide: "right",
        trueWindFromDeg: 0,
      }),
    ).toEqual({ ok: true, output: { oppositeLaylineBearingDeg: 45 } });
    expect(
      runOppositeTackLaylineBearing({
        laylineSide: "left",
        trueWindFromDeg: 360,
      }),
    ).toEqual({ ok: true, output: { oppositeLaylineBearingDeg: 315 } });
  });

  it("wraps bearings past north on both sides", () => {
    expect(
      calculateOppositeTackLaylineBearing({
        laylineSide: "right",
        closeHauledAngleDeg: 50,
        trueWindFromDeg: 330,
      }),
    ).toEqual({ oppositeLaylineBearingDeg: 20 });
    expect(
      calculateOppositeTackLaylineBearing({
        laylineSide: "left",
        closeHauledAngleDeg: 50,
        trueWindFromDeg: 30,
      }),
    ).toEqual({ oppositeLaylineBearingDeg: 340 });
  });

  it("mirrors left and right around the wind direction", () => {
    const right = calculateOppositeTackLaylineBearing({
      laylineSide: "right",
      closeHauledAngleDeg: 40,
      trueWindFromDeg: 120,
    })!.oppositeLaylineBearingDeg;
    const left = calculateOppositeTackLaylineBearing({
      laylineSide: "left",
      closeHauledAngleDeg: 40,
      trueWindFromDeg: 120,
    })!.oppositeLaylineBearingDeg;
    expect(left).toBe(80);
    expect(right).toBe(160);
  });

  it.each([[19], [90], [-45]])(
    "rejects tacking angles outside twenty to eighty nine",
    (closeHauledAngleDeg) => {
      expect(
        runOppositeTackLaylineBearing({
          laylineSide: "right",
          closeHauledAngleDeg,
          trueWindFromDeg: 0,
        }),
      ).toMatchObject({
        error: { issues: [{ code: "invalid_field" }] },
        ok: false,
      });
    },
  );

  it.each([[-1], [361]])(
    "rejects wind directions outside zero to three sixty",
    (trueWindFromDeg) => {
      expect(
        calculateOppositeTackLaylineBearing({
          laylineSide: "right",
          trueWindFromDeg,
        }),
      ).toBeNull();
      const result = runOppositeTackLaylineBearing({
        laylineSide: "right",
        trueWindFromDeg,
      });
      expect(result.ok).toBe(false);
      if (!result.ok) expect(result.error.issues[0]?.code).toBe("invalid_wind");
    },
  );

  it("rejects invalid sides and unknown fields", () => {
    expect(
      runOppositeTackLaylineBearing({
        laylineSide: "upwind",
        trueWindFromDeg: 0,
      } as never),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_field" }] },
      ok: false,
    });
    expect(
      runOppositeTackLaylineBearing({
        gust: 22,
        laylineSide: "left",
        trueWindFromDeg: 10,
      } as never),
    ).toMatchObject({
      error: { issues: [{ code: "unknown_field" }] },
      ok: false,
    });
  });
});
