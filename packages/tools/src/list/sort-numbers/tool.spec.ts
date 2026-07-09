import { describe, expect, it } from "vitest";
import { runSortNumbers } from "./tool.js";
describe("Sort Numbers Tool", () => {
  it("calculates a valid result", () => {
    expect(runSortNumbers({ values: [3, 1, 2], descending: false })).toEqual({
      ok: true,
      output: { values: [1, 2, 3] },
    });
  });
  it("rejects invalid input", () =>
    expect(runSortNumbers(null).ok).toBe(false));
});
