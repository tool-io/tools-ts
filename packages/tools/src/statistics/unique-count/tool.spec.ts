import { describe, expect, it } from "vitest";
import { runUniqueCount } from "./tool.js";

describe("Unique Count Tool", () => {
  it("calculates a valid result", () => {
    expect(runUniqueCount({ values: [1, 2, 2, 3, 3, 3] })).toEqual({
      ok: true,
      output: { unique: 3 },
    });
  });

  it("returns zero for an empty list", () => {
    expect(runUniqueCount({ values: [] })).toEqual({
      ok: true,
      output: { unique: 0 },
    });
  });

  it("rejects invalid input", () =>
    expect(runUniqueCount(null).ok).toBe(false));
});
