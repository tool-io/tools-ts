import { describe, expect, it } from "vitest";
import { runShannonEntropy } from "./tool.js";
describe("Shannon Entropy Calculator", () => {
  it("calculates a valid result", () => {
    expect(runShannonEntropy({ probabilities: [0.5, 0.5] })).toEqual({
      ok: true,
      output: { entropyBits: 1 },
    });
  });
  it("rejects invalid input", () =>
    expect(runShannonEntropy(null).ok).toBe(false));
});
