import { describe, expect, it } from "vitest";
import { runRatioToPercentage } from "./tool.js";

describe("Ratio to Percentage Converter", () => {
  it("calculates a valid result", () => {
    expect(runRatioToPercentage({ ratio: 0.25 })).toEqual({
      ok: true,
      output: { percent: 25 },
    });
    expect(runRatioToPercentage({ ratio: 2 })).toEqual({
      ok: true,
      output: { percent: 200 },
    });
  });

  it("rejects invalid input", () =>
    expect(runRatioToPercentage(null).ok).toBe(false));
});
