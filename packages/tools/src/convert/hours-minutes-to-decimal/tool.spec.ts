import { describe, expect, it } from "vitest";
import { runHoursMinutesToDecimal } from "./tool.js";
describe("Hours and Minutes to Decimal Hours Converter", () => {
  it("calculates a valid result", () => {
    expect(runHoursMinutesToDecimal({ hours: 2, minutes: 30 })).toEqual({
      ok: true,
      output: { decimalHours: 2.5 },
    });
  });
  it("rejects invalid input", () =>
    expect(runHoursMinutesToDecimal(null).ok).toBe(false));
});
