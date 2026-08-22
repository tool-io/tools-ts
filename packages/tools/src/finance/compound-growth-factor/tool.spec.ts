import { describe, expect, it } from "vitest";
import { runCompoundGrowthFactor } from "./tool.js";

describe("Compound Growth Factor Calculator", () => {
  it("calculates a valid result", () => {
    expect(runCompoundGrowthFactor({ periods: 2, ratePercent: 10 })).toEqual({
      ok: true,
      output: { factor: expect.closeTo(1.21, 12) },
    });
  });

  it("returns one factor for zero periods", () => {
    expect(runCompoundGrowthFactor({ periods: 0, ratePercent: 7 })).toEqual({
      ok: true,
      output: { factor: 1 },
    });
  });

  it("rejects invalid input", () =>
    expect(runCompoundGrowthFactor(null).ok).toBe(false));
});
