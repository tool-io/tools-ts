import { describe, expect, it } from "vitest";
import {
  calculateCurrentGainLoss,
  currentGainLossExample,
  runCurrentGainLoss,
} from "./tool.js";

describe("Current Gain Loss Calculator", () => {
  it("publishes an executable example", () =>
    expect(runCurrentGainLoss(currentGainLossExample.input)).toEqual({
      ok: true,
      output: currentGainLossExample.output,
    }));

  it.each([
    [2, 1.5, 3],
    [3, 2, 6],
    [0.5, 4, 2],
    [-3, 2, -6],
    [0, 10, 0],
    [10, 0.5, 5],
  ])("calculates the gain or loss", (current, hours, expected) => {
    expect(calculateCurrentGainLoss(current, hours)).toBe(expected);
  });

  it("returns a negative loss for an adverse set", () => {
    const result = runCurrentGainLoss({
      currentSpeedKt: -2.5,
      hoursOnCourse: 2,
    });
    expect(result).toEqual({
      ok: true,
      output: { gainLossNm: -5 },
    });
  });

  it("scales linearly with hours on course", () => {
    expect(calculateCurrentGainLoss(2, 4)!).toBe(
      calculateCurrentGainLoss(2, 2)! * 2,
    );
  });

  it("accepts large finite signed currents", () => {
    expect(calculateCurrentGainLoss(-10, 1)).toBe(-10);
    expect(calculateCurrentGainLoss(10, 1)).toBe(10);
  });

  it("does not impose an arbitrary current limit", () => {
    expect(calculateCurrentGainLoss(25, 1)).toBe(25);
    expect(calculateCurrentGainLoss(-10.5, 2)).toBe(-21);
  });

  it("returns zero gain or loss at zero hours", () => {
    expect(calculateCurrentGainLoss(2, 0)).toBe(0);
    expect(runCurrentGainLoss({ currentSpeedKt: 2, hoursOnCourse: 0 })).toEqual(
      {
        ok: true,
        output: { gainLossNm: 0 },
      },
    );
  });

  it.each([[-1]])("rejects negative hours", (hours) => {
    expect(calculateCurrentGainLoss(2, hours)).toBeNull();
    const result = runCurrentGainLoss({
      currentSpeedKt: 2,
      hoursOnCourse: hours,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]?.code).toBe("invalid_hours");
  });

  it("rejects non-finite inputs", () => {
    const result = runCurrentGainLoss({
      currentSpeedKt: Number.POSITIVE_INFINITY,
      hoursOnCourse: 1,
    });
    expect(result.ok).toBe(false);
  });

  it("rejects unknown input fields", () => {
    const result = runCurrentGainLoss({
      currentSpeedKt: 2,
      hoursOnCourse: 1,
      extra: 1,
    });
    expect(result.ok).toBe(false);
  });
});
