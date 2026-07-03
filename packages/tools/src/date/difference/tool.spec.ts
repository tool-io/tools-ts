import { describe, expect, it } from "vitest";
import { runDifference } from "./tool.js";
describe("Date Difference Calculator", () => {
  it("calculates a valid result", () => {
    expect(
      runDifference({ startDate: "2024-01-01", endDate: "2024-01-10" }),
    ).toEqual({ ok: true, output: { days: 9 } });
  });
  it("rejects invalid input", () => expect(runDifference(null).ok).toBe(false));
});
