import { describe, expect, it } from "vitest";
import { runNormalizeWhitespace } from "./tool.js";
describe("Text Whitespace Normalizer", () => {
  it("calculates a valid result", () => {
    expect(runNormalizeWhitespace({ text: " a\n  b\t c " })).toEqual({
      ok: true,
      output: { text: "a b c" },
    });
  });
  it("rejects invalid input", () =>
    expect(runNormalizeWhitespace(null).ok).toBe(false));
});
