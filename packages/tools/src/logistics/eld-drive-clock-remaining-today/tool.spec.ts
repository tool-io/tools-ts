import { describe, expect, it } from "vitest";
import {
  calculateEldDriveClockRemainingToday,
  eldDriveClockRemainingTodayExample,
  runEldDriveClockRemainingToday,
} from "./tool.js";

describe("eld-drive-clock-remaining-today", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runEldDriveClockRemainingToday(eldDriveClockRemainingTodayExample.input),
    ).toEqual({
      ok: true,
      output: eldDriveClockRemainingTodayExample.output,
    });
  });

  it("clamps at zero and forces a stop at the limit", () => {
    expect(
      runEldDriveClockRemainingToday({ driveHoursUsedToday: 11.5 }),
    ).toEqual({
      ok: true,
      output: { driveHoursRemaining: 0, mustStopDriving: true },
    });
  });

  it("rejects a non-positive drive limit", () => {
    expect(
      runEldDriveClockRemainingToday({
        driveHoursUsedToday: 2,
        driveLimitHoursToday: 0,
      }).ok,
    ).toBe(false);
  });

  it("rejects non-finite used hours", () => {
    expect(() =>
      calculateEldDriveClockRemainingToday({
        driveHoursUsedToday: Number.POSITIVE_INFINITY,
      }),
    ).toThrow("must be finite");
  });
});
