import { describe, expect, it } from "vitest";
import { runLInfinityNorm } from "./tool.js";
describe("Vector L-Infinity Norm Calculator", () => {
  it("calculates a valid result", () => {
    expect(runLInfinityNorm({ vector: [-1, 5, -3] })).toEqual({
      ok: true,
      output: { norm: 5 },
    });
  });
  it("rejects invalid input", () =>
    expect(runLInfinityNorm(null).ok).toBe(false));
});
