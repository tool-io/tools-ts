import { describe, expect, it } from "vitest";
import { runCrossProduct } from "./tool.js";
describe("Vector Cross Product Calculator", () => {
  it("calculates a valid result", () => {
    expect(runCrossProduct({ first: [1, 0, 0], second: [0, 1, 0] })).toEqual({
      ok: true,
      output: { vector: [0, 0, 1] },
    });
  });
  it("rejects invalid input", () =>
    expect(runCrossProduct(null).ok).toBe(false));
});
