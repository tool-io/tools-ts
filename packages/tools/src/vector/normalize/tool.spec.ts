import { describe, expect, it } from "vitest";
import { runNormalize } from "./tool.js";
describe("Vector Normalization Calculator", () => {
  it("calculates a valid result", () => {
    expect(runNormalize({ vector: [3, 4] })).toEqual({
      ok: true,
      output: { vector: [0.6, 0.8], magnitude: 5 },
    });
  });
  it("rejects invalid input", () => expect(runNormalize(null).ok).toBe(false));
});
