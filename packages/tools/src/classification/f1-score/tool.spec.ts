import { describe, expect, it } from "vitest";
import { runF1Score } from "./tool.js";
describe("F1 Score Calculator", () => {
  it("calculates a valid result", () => {
    expect(
      runF1Score({ truePositive: 8, falsePositive: 2, falseNegative: 2 }),
    ).toEqual({ ok: true, output: { f1Score: 0.8 } });
  });
  it("rejects invalid input", () => expect(runF1Score(null).ok).toBe(false));
});
