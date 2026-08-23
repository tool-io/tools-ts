import { describe, expect, it } from "vitest";
import {
  businessDaysExample,
  calculateBusinessDays,
  runBusinessDays,
} from "./tool.js";

describe("date/business-days", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runBusinessDays(businessDaysExample.input)).toEqual({
      ok: true,
      output: businessDaysExample.output,
    });
  });
  it("rejects invalid input (reversed_range)", () => {
    expect(
      runBusinessDays({ startDate: "2026-08-21", endDate: "2026-08-17" }).ok,
    ).toBe(false);
  });
  it("rejects invalid input (case)", () => {
    expect(
      runBusinessDays({ startDate: "2026/08/17", endDate: "2026-08-21" }).ok,
    ).toBe(false);
  });
  it("rejects invalid input (case)", () => {
    expect(
      runBusinessDays({ startDate: "2026-02-30", endDate: "2026-03-01" }).ok,
    ).toBe(false);
  });
  it("rejects invalid input (case)", () => {
    expect(
      runBusinessDays({
        startDate: "2026-08-17",
        endDate: "2026-08-21",
        holidays: ["19-08-2026"],
      }).ok,
    ).toBe(false);
  });
  it("counts five weekdays in a plain Monday-to-Friday week", () => {
    const result = runBusinessDays({
      endDate: "2026-08-21",
      startDate: "2026-08-17",
    });
    expect(result).toEqual({
      ok: true,
      output: {
        businessDayCount: 5,
        weekendDayCount: 0,
        holidayCount: 0,
        totalDays: 5,
      },
    });
  });

  it("treats weekend holidays as ordinary weekends", () => {
    const result = runBusinessDays({
      endDate: "2026-08-24",
      holidays: ["2026-08-22", "2026-08-23"],
      startDate: "2026-08-22",
    });
    expect(result).toEqual({
      ok: true,
      output: {
        businessDayCount: 1,
        weekendDayCount: 2,
        holidayCount: 0,
        totalDays: 3,
      },
    });
  });

  it("deduplicates repeated holiday dates", () => {
    const result = runBusinessDays({
      endDate: "2026-12-31",
      holidays: ["2026-12-25", "2026-12-25"],
      startDate: "2026-12-24",
    });
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.output.holidayCount).toBe(1);
  });
});
