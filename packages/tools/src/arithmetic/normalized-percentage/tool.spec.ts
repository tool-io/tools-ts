import { describe, expect, it } from "vitest";
import { runNormalizedPercentage } from "./tool.js";

describe("Normalized Percentage Calculator", () => {
  it("calculates a valid result", () => {
    expect(runNormalizedPercentage({ max: 100, min: 0, value: 40 })).toEqual({
      ok: true,
      output: { percent: 40 },
    });
    expect(runNormalizedPercentage({ max: 60, min: 50, value: 55 })).toEqual({
      ok: true,
      output: { percent: 50 },
    });
  });

  it("rejects equal bounds through execution", () => {
    expect(
      runNormalizedPercentage({ max: 10, min: 10, value: 5 }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_range" }] },
      ok: false,
    });
  });

  it("rejects invalid input", () =>
    expect(runNormalizedPercentage(null).ok).toBe(false));
});
