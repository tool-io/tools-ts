import { describe, expect, it } from "vitest";
import {
  calculatePersistentShiftRate,
  persistentShiftRateExample,
  runPersistentShiftRate,
} from "./tool.js";

describe("Shift Rate Calculator", () => {
  it("publishes an executable example", () =>
    expect(runPersistentShiftRate(persistentShiftRateExample.input)).toEqual({
      ok: true,
      output: persistentShiftRateExample.output,
    }));

  it.each([
    [310, 295, 30, 0.5],
    [295, 310, 30, -0.5],
    [20, 20, 15, 0],
    [100, 40, 2.5, 24],
    [-10, 10, 4, -5],
  ])(
    "divides the heading change by the elapsed minutes",
    (newMeanHeadingDeg, oldMeanHeadingDeg, elapsedMinutes, expected) => {
      expect(
        calculatePersistentShiftRate({
          elapsedMinutes,
          newMeanHeadingDeg,
          oldMeanHeadingDeg,
        }),
      ).toEqual({ rateDegPerMinute: expected });
    },
  );

  it("reports a positive rate for veers and negative for backs", () => {
    const veer = calculatePersistentShiftRate({
      elapsedMinutes: 10,
      newMeanHeadingDeg: 350,
      oldMeanHeadingDeg: 320,
    });
    const back = calculatePersistentShiftRate({
      elapsedMinutes: 10,
      newMeanHeadingDeg: 290,
      oldMeanHeadingDeg: 320,
    });
    expect(veer.rateDegPerMinute).toBeGreaterThan(0);
    expect(back.rateDegPerMinute).toBeLessThan(0);
  });

  it("uses the shortest signed change across north", () => {
    expect(
      calculatePersistentShiftRate({
        elapsedMinutes: 10,
        newMeanHeadingDeg: 10,
        oldMeanHeadingDeg: 350,
      }),
    ).toEqual({ rateDegPerMinute: 2 });
    expect(
      calculatePersistentShiftRate({
        elapsedMinutes: 10,
        newMeanHeadingDeg: 350,
        oldMeanHeadingDeg: 10,
      }),
    ).toEqual({ rateDegPerMinute: -2 });
  });

  it("accepts fractional elapsed times", () =>
    expect(
      runPersistentShiftRate({
        elapsedMinutes: 0.5,
        newMeanHeadingDeg: 30,
        oldMeanHeadingDeg: 15,
      }),
    ).toEqual({
      ok: true,
      output: { rateDegPerMinute: 30 },
    }));

  it("rejects zero or negative elapsed minutes", () => {
    for (const elapsedMinutes of [0, -10]) {
      const result = runPersistentShiftRate({
        elapsedMinutes,
        newMeanHeadingDeg: 310,
        oldMeanHeadingDeg: 295,
      });
      expect(result.ok).toBe(false);
      if (!result.ok)
        expect(result.error.issues[0]?.code).toBe("invalid_elapsed");
    }
  });

  it("rejects non-finite input", () => {
    expect(
      runPersistentShiftRate({
        elapsedMinutes: 30,
        newMeanHeadingDeg: Number.NaN,
        oldMeanHeadingDeg: 295,
      }).ok,
    ).toBe(false);
    expect(
      runPersistentShiftRate({
        elapsedMinutes: Number.POSITIVE_INFINITY,
        newMeanHeadingDeg: 310,
        oldMeanHeadingDeg: 295,
      }).ok,
    ).toBe(false);
  });

  it("rejects missing and malformed input", () => {
    expect(
      runPersistentShiftRate({ elapsedMinutes: 30, newMeanHeadingDeg: 310 }).ok,
    ).toBe(false);
    expect(
      runPersistentShiftRate({
        elapsedMinutes: 30,
        newMeanHeadingDeg: 310,
        oldMeanHeadingDeg: "295",
      }).ok,
    ).toBe(false);
  });

  it("rejects unknown input fields", () =>
    expect(
      runPersistentShiftRate({
        elapsedMinutes: 30,
        newMeanHeadingDeg: 310,
        oldMeanHeadingDeg: 295,
        extra: 0,
      }).ok,
    ).toBe(false));
});
