import { describe, expect, it } from "vitest";
import { runIsoWeekday } from "./tool.js";
describe("ISO Weekday Calculator", () => {
  it("calculates a valid result", () => {
    expect(runIsoWeekday({ date: "2024-01-01" })).toEqual({
      ok: true,
      output: { weekday: 1, name: "Monday" },
    });
  });
  it("rejects invalid input", () => expect(runIsoWeekday(null).ok).toBe(false));
});
