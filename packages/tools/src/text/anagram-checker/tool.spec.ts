import { describe, expect, it } from "vitest";
import { runAnagramChecker } from "./tool.js";

describe("Anagram Checker Tool", () => {
  it("detects a simple anagram", () => {
    expect(runAnagramChecker({ textA: "listen", textB: "silent" })).toEqual({
      ok: true,
      output: { isAnagram: true },
    });
  });

  it("rejects non-anagrams", () => {
    expect(runAnagramChecker({ textA: "hello", textB: "world" })).toEqual({
      ok: true,
      output: { isAnagram: false },
    });
  });

  it("ignores case, spaces and punctuation", () => {
    expect(
      runAnagramChecker({ textA: "Dormitory", textB: "Dirty Room!" }),
    ).toEqual({
      ok: true,
      output: { isAnagram: true },
    });
  });

  it("rejects invalid input", () =>
    expect(runAnagramChecker(null).ok).toBe(false));
});
