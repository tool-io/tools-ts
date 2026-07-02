import { describe, expect, it } from "vitest";
import { runAccuracy } from "./tool.js";
describe("Accuracy Calculator", () => {
  it("calculates a valid result", () => {
    expect(
      runAccuracy({
        truePositive: 8,
        trueNegative: 7,
        falsePositive: 3,
        falseNegative: 2,
      }),
    ).toEqual({ ok: true, output: { accuracy: 0.75 } });
  });
  it("rejects invalid input", () => expect(runAccuracy(null).ok).toBe(false));
});
