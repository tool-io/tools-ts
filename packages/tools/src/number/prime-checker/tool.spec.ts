import { describe, expect, it } from "vitest";
import { runPrimeChecker } from "./tool.js";
describe("Prime Number Checker", () => {
  it("calculates a valid result", () =>
    expect(runPrimeChecker({ value: 97 })).toEqual({
      ok: true,
      output: { prime: true },
    }));
  it("rejects invalid input", () =>
    expect(runPrimeChecker(null).ok).toBe(false));
});
