import { describe, expect, it } from "vitest";
import { runPalindromeChecker } from "./tool.js";

describe("Palindrome Checker Tool", () => {
  it("detects a simple palindrome", () => {
    expect(runPalindromeChecker({ text: "racecar" })).toEqual({
      ok: true,
      output: { isPalindrome: true },
    });
  });

  it("rejects non-palindromes", () => {
    expect(runPalindromeChecker({ text: "hello" })).toEqual({
      ok: true,
      output: { isPalindrome: false },
    });
  });

  it("ignores case, spaces and punctuation", () => {
    expect(
      runPalindromeChecker({ text: "A man, a plan, a canal: Panama" }),
    ).toEqual({
      ok: true,
      output: { isPalindrome: true },
    });
  });

  it("rejects invalid input", () =>
    expect(runPalindromeChecker(null).ok).toBe(false));
});
