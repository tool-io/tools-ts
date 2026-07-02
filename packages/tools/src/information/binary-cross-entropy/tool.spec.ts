import { describe, expect, it } from "vitest";
import { runBinaryCrossEntropy } from "./tool.js";
describe("Binary Cross-Entropy Calculator", () => {
  it("calculates a valid result", () => {
    const result = runBinaryCrossEntropy({ label: 1, probability: 0.5 });
    expect(result.ok && result.output.crossEntropy).toBeCloseTo(Math.log(2));
  });
  it("rejects invalid input", () =>
    expect(runBinaryCrossEntropy(null).ok).toBe(false));
});
