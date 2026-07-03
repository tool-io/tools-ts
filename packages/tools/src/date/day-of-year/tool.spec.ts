import { describe, expect, it } from "vitest";
import { runDayOfYear } from "./tool.js";
describe("Day of Year Calculator", () => {
  it("calculates a valid result", () => {
    expect(runDayOfYear({ date: "2024-03-01" })).toEqual({
      ok: true,
      output: { dayOfYear: 61 },
    });
  });
  it("rejects invalid input", () => expect(runDayOfYear(null).ok).toBe(false));
});
