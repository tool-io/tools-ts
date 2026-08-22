import { describe, expect, it } from "vitest";
import { runStraightLineDepreciation } from "./tool.js";

describe("Straight-Line Depreciation Calculator", () => {
  it("calculates a valid result", () => {
    expect(
      runStraightLineDepreciation({
        cost: 11000,
        salvageValue: 1000,
        usefulLifeYears: 5,
      }),
    ).toEqual({
      ok: true,
      output: { annualDepreciation: 2000 },
    });
  });

  it("rejects non-positive life through execution", () => {
    expect(
      runStraightLineDepreciation({
        cost: 5000,
        salvageValue: 0,
        usefulLifeYears: 0,
      }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_life" }] },
      ok: false,
    });
  });

  it("rejects invalid input", () =>
    expect(runStraightLineDepreciation(null).ok).toBe(false));
});
