import { describe, expect, it } from "vitest";
import {
  annualCalendarTransitionExample,
  mapAnnualCalendarMonthTransition,
  runAnnualCalendarTransition,
} from "./tool.js";

describe("annual-calendar month transition corrector", () => {
  it("reproduces the canonical 30-day-month correction", () => {
    expect(
      runAnnualCalendarTransition(annualCalendarTransitionExample.input),
    ).toEqual({ ok: true, output: annualCalendarTransitionExample.output });
  });

  it("requires correction after February 29 in a leap year", () => {
    expect(
      mapAnnualCalendarMonthTransition({ day: 29, month: 2, year: 2024 }),
    ).toMatchObject({
      correctionRequired: true,
      nextCalendarDate: "2024-03-01",
    });
  });

  it("requires correction after February 28 in a common year", () => {
    expect(
      mapAnnualCalendarMonthTransition({ day: 28, month: 2, year: 2023 }),
    ).toMatchObject({
      correctionRequired: true,
      nextCalendarDate: "2023-03-01",
    });
  });

  it("advances an ordinary 31-day month without correction", () => {
    expect(
      mapAnnualCalendarMonthTransition({ day: 30, month: 1, year: 2024 }),
    ).toMatchObject({
      correctionRequired: false,
      nextCalendarDate: "2024-01-31",
    });
  });

  it("rolls December into the next year", () => {
    expect(
      mapAnnualCalendarMonthTransition({ day: 31, month: 12, year: 2024 }),
    ).toMatchObject({ nextCalendarDate: "2025-01-01", nextYear: 2025 });
  });

  it("rejects February 29 in a common year", () => {
    expect(
      runAnnualCalendarTransition({ day: 29, month: 2, year: 2023 }),
    ).toMatchObject({
      error: { issues: [{ code: "day_out_of_range", field: "day" }] },
      ok: false,
    });
  });
});
