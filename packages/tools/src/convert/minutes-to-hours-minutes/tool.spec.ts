import { describe, expect, it } from "vitest";
import { runMinutesToHoursMinutes } from "./tool.js";
describe("Minutes to Hours and Minutes Converter", () => {
  it("calculates a valid result", () => {
    expect(runMinutesToHoursMinutes({ totalMinutes: 150 })).toEqual({
      ok: true,
      output: { hours: 2, minutes: 30 },
    });
  });
  it("rejects invalid input", () =>
    expect(runMinutesToHoursMinutes(null).ok).toBe(false));
});
