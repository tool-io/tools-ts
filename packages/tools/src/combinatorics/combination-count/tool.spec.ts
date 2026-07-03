import { describe, expect, it } from "vitest";
import { runCombinationCount } from "./tool.js";
describe("Combination Count Calculator", () => {
  it("calculates a valid result", () =>
    expect(runCombinationCount({ n: 5, k: 2 })).toEqual({
      ok: true,
      output: { combinations: 10 },
    }));
  it("rejects invalid input", () =>
    expect(runCombinationCount(null).ok).toBe(false));
});
