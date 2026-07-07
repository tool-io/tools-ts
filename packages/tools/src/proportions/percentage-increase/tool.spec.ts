import { describe, expect, it } from "vitest";
import { runPercentageIncrease } from "./tool.js";
describe("Percentage Increase Calculator", () => {
  it("calculates a valid result", () => {
    expect(runPercentageIncrease({ originalValue: 80, newValue: 100 })).toEqual(
      { ok: true, output: { percentIncrease: 25 } },
    );
  });
  it("rejects invalid input", () =>
    expect(runPercentageIncrease(null).ok).toBe(false));
});
