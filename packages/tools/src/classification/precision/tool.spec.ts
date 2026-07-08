import { describe, expect, it } from "vitest";
import { runPrecision } from "./tool.js";
describe("Precision Calculator", () => {
  it("calculates a valid result", () => {
    expect(runPrecision({ truePositive: 8, falsePositive: 2 })).toEqual({
      ok: true,
      output: { precision: 0.8 },
    });
  });
  it("rejects invalid input", () => expect(runPrecision(null).ok).toBe(false));
});
