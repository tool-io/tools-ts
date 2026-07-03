import { describe, expect, it } from "vitest";
import { runAddDays } from "./tool.js";
describe("Date Add Days Calculator", () => {
  it("calculates a valid result", () => {
    expect(runAddDays({ date: "2024-02-28", days: 2 })).toEqual({
      ok: true,
      output: { date: "2024-03-01" },
    });
  });
  it("rejects invalid input", () => expect(runAddDays(null).ok).toBe(false));
});
