import { describe, expect, it } from "vitest";
import { runPercentagePoints } from "./tool.js";

describe("Percentage Points Calculator", () => {
  it("calculates a valid result", () => {
    expect(runPercentagePoints({ percentA: 52, percentB: 47 })).toEqual({
      ok: true,
      output: { percentagePoints: 5 },
    });
  });

  it("keeps negative differences for decreases", () => {
    expect(runPercentagePoints({ percentA: 44, percentB: 49 })).toEqual({
      ok: true,
      output: { percentagePoints: -5 },
    });
  });

  it("rejects invalid input", () =>
    expect(runPercentagePoints(null).ok).toBe(false));
});
