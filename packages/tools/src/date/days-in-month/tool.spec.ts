import { describe, expect, it } from "vitest";
import { runDaysInMonth } from "./tool.js";
describe("Days in Month Calculator", () => {
  it("calculates a valid result", () => {
    expect(runDaysInMonth({ year: 2024, month: 2 })).toEqual({
      ok: true,
      output: { days: 29 },
    });
  });
  it("rejects invalid input", () =>
    expect(runDaysInMonth(null).ok).toBe(false));
});
