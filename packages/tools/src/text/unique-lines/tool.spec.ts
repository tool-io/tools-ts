import { describe, expect, it } from "vitest";
import { runUniqueLines } from "./tool.js";
describe("Text Unique Lines Tool", () => {
  it("calculates a valid result", () => {
    expect(runUniqueLines({ text: "a\nb\na" })).toEqual({
      ok: true,
      output: { text: "a\nb" },
    });
  });
  it("rejects invalid input", () =>
    expect(runUniqueLines(null).ok).toBe(false));
});
