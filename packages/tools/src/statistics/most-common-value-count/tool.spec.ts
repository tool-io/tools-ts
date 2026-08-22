import { describe, expect, it } from "vitest";
import { runMostCommonValueCount } from "./tool.js";

describe("Most Common Value Count Tool", () => {
  it("calculates a valid result", () => {
    expect(runMostCommonValueCount({ values: [1, 2, 2, 3, 3, 3] })).toEqual({
      ok: true,
      output: { count: 3 },
    });
  });

  it("returns zero for an empty list", () => {
    expect(runMostCommonValueCount({ values: [] })).toEqual({
      ok: true,
      output: { count: 0 },
    });
  });

  it("rejects invalid input", () =>
    expect(runMostCommonValueCount(null).ok).toBe(false));
});
