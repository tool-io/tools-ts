import { describe, expect, it } from "vitest";
import { runNumberAsPercentage } from "./tool.js";
describe("Number as Percentage Calculator", () => {
  it("calculates a valid result", () => {
    expect(runNumberAsPercentage({ part: 30, whole: 120 })).toEqual({
      ok: true,
      output: { percent: 25 },
    });
  });
  it("rejects invalid input", () =>
    expect(runNumberAsPercentage(null).ok).toBe(false));
});
