import { describe, expect, it } from "vitest";
import { runRemoveBlankLines } from "./tool.js";
describe("Text Remove Blank Lines Tool", () => {
  it("calculates a valid result", () => {
    expect(runRemoveBlankLines({ text: "a\n \nb" })).toEqual({
      ok: true,
      output: { text: "a\nb" },
    });
  });
  it("rejects invalid input", () =>
    expect(runRemoveBlankLines(null).ok).toBe(false));
});
