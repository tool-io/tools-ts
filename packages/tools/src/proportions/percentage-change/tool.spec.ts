import { describe, expect, it } from "vitest";
import { runPercentageChange } from "./tool.js";
describe("Percentage Change Calculator", () => {
  it("calculates a valid result", () => {
    expect(runPercentageChange({ oldValue: 80, newValue: 100 })).toEqual({
      ok: true,
      output: { percentChange: 25 },
    });
  });
  it("rejects invalid input", () =>
    expect(runPercentageChange(null).ok).toBe(false));
});
