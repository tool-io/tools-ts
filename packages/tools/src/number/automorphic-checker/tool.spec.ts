import { describe, expect, it } from "vitest";
import { runAutomorphicChecker } from "./tool.js";

describe("Automorphic Number Checker", () => {
  it("calculates a valid result", () => {
    expect(runAutomorphicChecker({ value: 76 })).toEqual({
      ok: true,
      output: { automorphic: true },
    });
    expect(runAutomorphicChecker({ value: 10 })).toEqual({
      ok: true,
      output: { automorphic: false },
    });
  });

  it("accepts zero and one", () => {
    expect(runAutomorphicChecker({ value: 0 })).toEqual({
      ok: true,
      output: { automorphic: true },
    });
    expect(runAutomorphicChecker({ value: 1 })).toEqual({
      ok: true,
      output: { automorphic: true },
    });
  });

  it("rejects invalid input", () =>
    expect(runAutomorphicChecker(null).ok).toBe(false));
});
