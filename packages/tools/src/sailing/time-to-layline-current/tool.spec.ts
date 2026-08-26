import { describe, expect, it } from "vitest";
import {
  calculateTimeToLaylineCurrent,
  timeToLaylineCurrentExample,
  runTimeToLaylineCurrent,
} from "./tool.js";

describe("Time to Layline Current-Corrected", () => {
  it("publishes an executable example", () =>
    expect(runTimeToLaylineCurrent(timeToLaylineCurrentExample.input)).toEqual({
      ok: true,
      output: timeToLaylineCurrentExample.output,
    }));

  it.each([
    [1.5, 4.5, 20],
    [1, 6, 10],
    [2, 5, 24],
    [0.25, 3, 5],
    [3, 12, 15],
  ])(
    "divides distance by VMG into minutes",
    (distanceToLaylineNm, vmgKt, expected) => {
      expect(
        calculateTimeToLaylineCurrent({ distanceToLaylineNm, vmgKt }),
      ).toEqual({ timeMinutes: expected });
    },
  );

  it("halves the time when VMG doubles", () => {
    const slow = calculateTimeToLaylineCurrent({
      distanceToLaylineNm: 1,
      vmgKt: 2,
    })!.timeMinutes;
    const fast = calculateTimeToLaylineCurrent({
      distanceToLaylineNm: 1,
      vmgKt: 4,
    })!.timeMinutes;
    expect(fast).toBeCloseTo(slow / 2, 12);
  });

  it("scales linearly with remaining distance", () => {
    const near = calculateTimeToLaylineCurrent({
      distanceToLaylineNm: 0.4,
      vmgKt: 4,
    })!.timeMinutes;
    const far = calculateTimeToLaylineCurrent({
      distanceToLaylineNm: 1.6,
      vmgKt: 4,
    })!.timeMinutes;
    expect(far).toBeCloseTo(near * 4, 12);
  });

  it.each([
    [0, 4],
    [-1, 4],
    [1, 0],
    [1, -2],
  ])("rejects non-positive distances and VMG", (distanceToLaylineNm, vmgKt) => {
    expect(
      calculateTimeToLaylineCurrent({ distanceToLaylineNm, vmgKt }),
    ).toBeNull();
    const result = runTimeToLaylineCurrent({ distanceToLaylineNm, vmgKt });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]?.code).toBe("invalid_value");
  });

  it("rejects non-finite inputs at the schema level", () => {
    expect(
      runTimeToLaylineCurrent({
        distanceToLaylineNm: Number.NaN,
        vmgKt: 4,
      }).ok,
    ).toBe(false);
    expect(
      runTimeToLaylineCurrent({
        distanceToLaylineNm: 1,
        vmgKt: Number.POSITIVE_INFINITY,
      }).ok,
    ).toBe(false);
  });

  it("rejects unknown fields and null input", () => {
    expect(
      runTimeToLaylineCurrent({ mark: 1, vmgKt: 4 } as never),
    ).toMatchObject({
      error: { issues: [{ code: "unknown_field" }] },
      ok: false,
    });
    expect(runTimeToLaylineCurrent(null as never).ok).toBe(false);
  });
});
