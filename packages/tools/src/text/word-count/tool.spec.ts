import { describe, expect, it } from "vitest";
import { runWordCount } from "./tool.js";
describe("Word Count Tool", () => {
  it("calculates a valid result", () => {
    expect(runWordCount({ text: "one two\nthree" })).toEqual({
      ok: true,
      output: { words: 3 },
    });
  });
  it("rejects invalid input", () => expect(runWordCount(null).ok).toBe(false));
});
