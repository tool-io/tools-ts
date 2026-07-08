import { describe, expect, it } from "vitest";
import { runRecall } from "./tool.js";
describe("Recall Calculator", () => {
  it("calculates a valid result", () => {
    expect(runRecall({ truePositive: 8, falseNegative: 2 })).toEqual({
      ok: true,
      output: { recall: 0.8 },
    });
  });
  it("rejects invalid input", () => expect(runRecall(null).ok).toBe(false));
});
