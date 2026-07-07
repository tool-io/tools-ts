import { describe, expect, it } from "vitest";
import { runPercentageDecrease } from "./tool.js";
describe("Percentage Decrease Calculator", () => {
  it("calculates a valid result", () => {
    expect(runPercentageDecrease({ originalValue: 100, newValue: 75 })).toEqual(
      { ok: true, output: { percentDecrease: 25 } },
    );
  });
  it("rejects invalid input", () =>
    expect(runPercentageDecrease(null).ok).toBe(false));
});
