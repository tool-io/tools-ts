import { describe, expect, it } from "vitest";
import {
  calculateLongestCommonPrefix,
  longestCommonPrefixExample,
  runLongestCommonPrefix,
} from "./tool.js";

describe("longest common prefix tool", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runLongestCommonPrefix(longestCommonPrefixExample.input),
    ).toEqual({ ok: true, output: longestCommonPrefixExample.output });
  });

  it("returns the single string and handles no common prefix", () => {
    expect(calculateLongestCommonPrefix({ strings: ["solo"] })).toEqual({
      prefix: "solo",
    });
    expect(
      calculateLongestCommonPrefix({ strings: ["abc", "xyz"] }),
    ).toEqual({ prefix: "" });
  });

  it("stops at an empty member through execution", () => {
    expect(runLongestCommonPrefix({ strings: ["ab", "", "abc"] })).toEqual({
      ok: true,
      output: { prefix: "" },
    });
    expect(runLongestCommonPrefix({ strings: [] })).toMatchObject({
      error: { issues: [{ code: "insufficient_strings" }] },
      ok: false,
    });
  });
});
