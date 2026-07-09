import { describe, expect, it } from "vitest";
import { runSpecificity } from "./tool.js";
describe("Specificity Calculator", () => {
  it("calculates a valid result", () => {
    expect(runSpecificity({ trueNegative: 9, falsePositive: 1 })).toEqual({
      ok: true,
      output: { specificity: 0.9 },
    });
  });
  it("rejects invalid input", () =>
    expect(runSpecificity(null).ok).toBe(false));
});
