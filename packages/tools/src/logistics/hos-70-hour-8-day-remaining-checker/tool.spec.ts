import { describe, expect, it } from "vitest";
import {
  hos70Hour8DayRemainingCheckerExample,
  runHos70Hour8DayRemainingChecker,
} from "./tool.js";

describe("hos-70-hour-8-day-remaining-checker", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runHos70Hour8DayRemainingChecker(
        hos70Hour8DayRemainingCheckerExample.input,
      ),
    ).toEqual({
      ok: true,
      output: hos70Hour8DayRemainingCheckerExample.output,
    });
  });

  it("reports a negative remainder once the cycle is exhausted", () => {
    expect(
      runHos70Hour8DayRemainingChecker({ hoursWorkedInLast8Days: 74 }),
    ).toEqual({
      ok: true,
      output: { cycleHoursRemaining: -4, withinCycle: false },
    });
  });

  it("rejects a non-positive cycle limit", () => {
    expect(
      runHos70Hour8DayRemainingChecker({
        cycleLimitHours: 0,
        hoursWorkedInLast8Days: 10,
      }).ok,
    ).toBe(false);
  });
});
