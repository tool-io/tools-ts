import { describe, expect, it } from "vitest";
import {
  weekNumberExample,
  calculateWeekNumber,
  runWeekNumber,
} from "./tool.js";

describe("date/week-number", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runWeekNumber(weekNumberExample.input)).toEqual({
      ok: true,
      output: weekNumberExample.output,
    });
  });
  it("rejects invalid input (invalid_date)", () => {
    expect(runWeekNumber({ date: "01/04/2021" }).ok).toBe(false);
  });
  it("rejects invalid input (invalid_date)", () => {
    expect(runWeekNumber({ date: "2021-02-30" }).ok).toBe(false);
  });
  it("follows ISO-8601 boundary rules", () => {
    const cases: ReadonlyArray<[string, number, number]> = [
      ["2021-01-01", 53, 2020],
      ["2020-12-31", 53, 2020],
      ["2019-12-30", 1, 2020],
      ["2016-01-03", 53, 2015],
      ["2021-12-31", 52, 2021],
      ["2026-08-25", 35, 2026],
    ];
    for (const [date, week, year] of cases) {
      const result = runWeekNumber({ date });
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.output.isoWeekNumber).toBe(week);
        expect(result.output.isoYear).toBe(year);
      }
    }
  });

  it("keeps weeks owned by the Thursday year", () => {
    const thursdayRule = runWeekNumber({ date: "2021-01-01" });
    expect(thursdayRule.ok && thursdayRule.output.isoYear).toBe(2020);
  });
});
