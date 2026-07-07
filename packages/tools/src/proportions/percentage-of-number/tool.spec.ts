import { describe, expect, it } from "vitest";
import { runPercentageOfNumber } from "./tool.js";
describe("Percentage of Number Calculator", () => {
  it("calculates a valid result", () => {
    expect(runPercentageOfNumber({ percent: 15, value: 200 })).toEqual({
      ok: true,
      output: { result: 30 },
    });
  });
  it("rejects invalid input", () =>
    expect(runPercentageOfNumber(null).ok).toBe(false));
});
