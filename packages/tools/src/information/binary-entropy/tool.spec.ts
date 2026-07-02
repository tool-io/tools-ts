import { describe, expect, it } from "vitest";
import { runBinaryEntropy } from "./tool.js";
describe("Binary Entropy Calculator", () => {
  it("calculates a valid result", () => {
    expect(runBinaryEntropy({ probability: 0.5 })).toEqual({
      ok: true,
      output: { entropyBits: 1 },
    });
  });
  it("rejects invalid input", () =>
    expect(runBinaryEntropy(null).ok).toBe(false));
});
