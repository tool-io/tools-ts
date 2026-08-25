import { describe, expect, it } from "vitest";
import {
  calculateDetentionDetachHoursTriggerChecker,
  detentionDetachHoursTriggerCheckerExample,
  runDetentionDetachHoursTriggerChecker,
} from "./tool.js";

describe("detention-detach-hours-trigger-checker", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runDetentionDetachHoursTriggerChecker(
        detentionDetachHoursTriggerCheckerExample.input,
      ),
    ).toEqual({
      ok: true,
      output: detentionDetachHoursTriggerCheckerExample.output,
    });
  });

  it("treats exactly the free time as not billable", () => {
    expect(
      runDetentionDetachHoursTriggerChecker({ hoursAtFacility: 2 }),
    ).toEqual({
      ok: true,
      output: { detentionBillableHours: 0, detentionTriggered: false },
    });
  });

  it("supports a zero-hour free-time policy", () => {
    expect(
      runDetentionDetachHoursTriggerChecker({
        hoursAtFacility: 3,
        freeTimeHoursBeforeDetention: 0,
      }),
    ).toEqual({
      ok: true,
      output: { detentionBillableHours: 3, detentionTriggered: true },
    });
  });

  it("rejects non-finite direct input", () => {
    expect(() =>
      calculateDetentionDetachHoursTriggerChecker({
        hoursAtFacility: Number.NaN,
      }),
    ).toThrow("must be finite");
  });
});
