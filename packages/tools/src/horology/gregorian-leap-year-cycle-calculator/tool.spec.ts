import { describe, expect, it } from "vitest";
import {
  calculateGregorianLeapYearCycle,
  gregorianLeapCycleExample,
  runGregorianLeapCycle,
} from "./tool.js";

describe("Gregorian leap-year cycle calculator", () => {
  it("reproduces the canonical century exception", () => {
    expect(runGregorianLeapCycle(gregorianLeapCycleExample.input)).toEqual({
      ok: true,
      output: gregorianLeapCycleExample.output,
    });
  });

  it("recognizes a year divisible by 400", () => {
    expect(calculateGregorianLeapYearCycle({ year: 2000 })).toMatchObject({
      centuryException: false,
      isLeapYear: true,
      leapYearPositionIn400YearCycle: 97,
      yearsUntilNextLeapYear: 0,
    });
  });

  it("counts the next leap year from an ordinary year", () => {
    expect(
      calculateGregorianLeapYearCycle({ year: 1899 }).yearsUntilNextLeapYear,
    ).toBe(5);
  });

  it("marks a current leap year with zero years remaining", () => {
    expect(
      calculateGregorianLeapYearCycle({ year: 2096 }).yearsUntilNextLeapYear,
    ).toBe(0);
  });

  it("rejects year zero", () => {
    expect(runGregorianLeapCycle({ year: 0 })).toMatchObject({
      error: { issues: [{ code: "invalid_field", field: "year" }] },
      ok: false,
    });
  });
});
