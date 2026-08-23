import { describe, expect, it } from "vitest";
import {
  longestCommonSubsequenceExample,
  calculateLongestCommonSubsequence,
  runLongestCommonSubsequence,
} from "./tool.js";

describe("text/longest-common-subsequence", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runLongestCommonSubsequence(longestCommonSubsequenceExample.input),
    ).toEqual({
      ok: true,
      output: longestCommonSubsequenceExample.output,
    });
  });
  it("returns identical strings untouched", () => {
    const result = runLongestCommonSubsequence({
      first: "kaleido",
      second: "kaleido",
    });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.output).toEqual({ length: 7, sequence: "kaleido" });
  });

  it("finds nothing between disjoint strings", () => {
    const disjoint = runLongestCommonSubsequence({
      first: "abc",
      second: "xyz",
    });
    expect(disjoint.ok).toBe(true);
    if (!disjoint.ok) return;
    expect(disjoint.output).toEqual({ length: 0, sequence: "" });
  });

  it("treats non-BMP Unicode characters as single characters", () => {
    expect(
      calculateLongestCommonSubsequence({ first: "A🚀B", second: "🚀" }),
    ).toEqual({
      length: 1,
      sequence: "🚀",
    });
  });
});
