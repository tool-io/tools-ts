import { describe, expect, it } from "vitest";
import { runSubstringCount } from "./tool.js";
describe("Substring Count Tool", () => {
  it("calculates a valid result", () => {
    expect(runSubstringCount({ text: "aaaa", substring: "aa" })).toEqual({
      ok: true,
      output: { count: 2 },
    });
  });
  it("rejects invalid input", () =>
    expect(runSubstringCount({ text: "x", substring: "" }).ok).toBe(false));
});
