import { describe, expect, it } from "vitest";
import { runDotProduct } from "./tool.js";
describe("Dot Product Calculator", () => {
  it("calculates a valid result", () => {
    expect(runDotProduct({ first: [1, 2, 3], second: [4, 5, 6] })).toEqual({
      ok: true,
      output: { dotProduct: 32 },
    });
  });
  it("rejects invalid input", () => expect(runDotProduct(null).ok).toBe(false));
});
