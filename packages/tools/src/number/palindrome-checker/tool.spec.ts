import { describe, expect, it } from "vitest";
import { runPalindromeChecker } from "./tool.js";
describe("Numeric Palindrome Checker", () => {
  it("calculates a valid result", () =>
    expect(runPalindromeChecker({ value: 12321 })).toEqual({
      ok: true,
      output: { palindrome: true },
    }));
  it("rejects invalid input", () =>
    expect(runPalindromeChecker(null).ok).toBe(false));
});
