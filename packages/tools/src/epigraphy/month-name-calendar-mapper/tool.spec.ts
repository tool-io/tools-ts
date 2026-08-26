import { describe, expect, it } from "vitest";
import {
  calculateMonthNameCalendarMapper,
  monthNameCalendarMapperExample,
  runMonthNameCalendarMapper,
} from "./tool.js";

describe("epigraphy/month-name-calendar-mapper", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runMonthNameCalendarMapper(monthNameCalendarMapperExample.input),
    ).toEqual({ ok: true, output: monthNameCalendarMapperExample.output });
  });

  it("maps archaic and abbreviated month names case-insensitively", () => {
    expect(calculateMonthNameCalendarMapper({ monthName: "sextilis" })).toEqual(
      {
        monthNumber: 8,
        modernMonthName: "August",
      },
    );
    expect(
      calculateMonthNameCalendarMapper({ monthName: "QUINCTILI" }),
    ).toEqual({
      monthNumber: 7,
      modernMonthName: "July",
    });
    expect(calculateMonthNameCalendarMapper({ monthName: "Ianuar." })).toEqual({
      monthNumber: 1,
      modernMonthName: "January",
    });
  });

  it("rejects unrecognized month names", () => {
    expect(runMonthNameCalendarMapper({ monthName: "Brumaire" }).ok).toBe(
      false,
    );
  });
});
