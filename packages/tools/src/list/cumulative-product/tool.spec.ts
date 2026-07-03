import { describe, expect, it } from "vitest";
import { runCumulativeProduct } from "./tool.js";
describe("Cumulative Product Calculator", () => {
  it("calculates a valid result", () => {
    expect(runCumulativeProduct({ values: [2, 3, 4] })).toEqual({
      ok: true,
      output: { products: [2, 6, 24] },
    });
  });
  it("rejects invalid input", () =>
    expect(runCumulativeProduct(null).ok).toBe(false));
});
