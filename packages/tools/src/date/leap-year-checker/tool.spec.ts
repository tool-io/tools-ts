import { describe, expect, it } from "vitest";
import { runLeapYearChecker } from "./tool.js";
describe("Leap Year Checker", () => {
  it("calculates a valid result", () => {
    expect(runLeapYearChecker({ year: 2000 })).toEqual({
      ok: true,
      output: { leapYear: true },
    });
  });
  it("rejects invalid input", () =>
    expect(runLeapYearChecker(null).ok).toBe(false));
});
