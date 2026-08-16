import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import {
  calculateBusinessDaysBetween,
  businessDaysBetweenExample,
  businessDaysBetweenTool,
} from "./tool.js";

const issueCodes = (result: ReturnType<typeof calculateBusinessDaysBetween>) =>
  result.ok ? [] : result.error.issues.map((issue) => issue.code);

describe("Business Days Between", () => {
  it("executes the canonical example to its exact declared output", () => {
    const result = businessDaysBetweenTool.execute(
      businessDaysBetweenExample.input,
    );
    expect(result).toEqual({
      ok: true,
      output: businessDaysBetweenExample.output,
    });
  });

  it("publishes a valid pure tool contract", () => {
    expect(businessDaysBetweenTool.id).toBe("date/business-days-between");
    expect(validateToolContract(businessDaysBetweenTool)).toEqual([]);
  });

  it("spans weekends and subtracts listed holidays", () => {
    const acrossWeekend = calculateBusinessDaysBetween({
      endDate: "2026-08-17",
      startDate: "2026-08-10",
    });
    // Mon 10 .. Sun 16 -> five weekdays.
    expect(acrossWeekend.ok).toBe(true);
    if (acrossWeekend.ok) expect(acrossWeekend.output.businessDayCount).toBe(5);

    const withHoliday = calculateBusinessDaysBetween({
      endDate: "2026-08-21",
      holidays: ["2026-08-18", "2026-08-15"],
      startDate: "2026-08-17",
    });
    expect(withHoliday.ok).toBe(true);
    if (withHoliday.ok) {
      // Saturday holiday is ignored.
      expect(withHoliday.output.holidayCount).toBe(1);
      expect(withHoliday.output.businessDayCount).toBe(3);
    }
  });

  it("supports empty and same-day ranges", () => {
    const sameDay = calculateBusinessDaysBetween({
      endDate: "2026-08-17",
      startDate: "2026-08-17",
    });
    expect(sameDay.ok).toBe(true);
    if (sameDay.ok) {
      expect(sameDay.output.totalDays).toBe(0);
      expect(sameDay.output.businessDayCount).toBe(0);
    }
  });

  it("rejects malformed dates and ranges", () => {
    expect(calculateBusinessDaysBetween(null).ok).toBe(false);
    expect(issueCodes(calculateBusinessDaysBetween({}))).toEqual([
      "start_date_required",
      "end_date_required",
    ]);
    expect(
      issueCodes(
        calculateBusinessDaysBetween({
          endDate: "2026-02-30",
          startDate: "2026-02-01",
        }),
      ),
    ).toEqual(["endDate_impossible"]);
    expect(
      issueCodes(
        calculateBusinessDaysBetween({
          endDate: "2026-01-01",
          startDate: "2026-03-01",
        }),
      ),
    ).toEqual(["range_reversed"]);
    expect(
      issueCodes(
        calculateBusinessDaysBetween({
          endDate: "2026-08-21",
          holidays: ["not-a-date"],
          startDate: "2026-08-17",
        }),
      ),
    ).toEqual(["holiday_invalid"]);
    expect(
      issueCodes(
        calculateBusinessDaysBetween({
          extra: 1,
          endDate: "2026-08-21",
          startDate: "2026-08-17",
        }),
      ),
    ).toEqual(["unknown_field"]);
  });
});
