import { describe, expect, it } from "vitest";
import { runLongestWord } from "./tool.js";

describe("Longest Word Finder", () => {
  it("calculates a valid result", () => {
    expect(runLongestWord({ text: "the quick brown fox" })).toEqual({
      ok: true,
      output: { length: 5, word: "quick" },
    });
  });

  it("returns the first longest word on ties", () => {
    expect(runLongestWord({ text: "cat dog bird fish" })).toEqual({
      ok: true,
      output: { length: 4, word: "bird" },
    });
  });

  it("rejects empty text through execution", () => {
    expect(runLongestWord({ text: "" })).toMatchObject({
      error: { issues: [{ code: "empty_text" }] },
      ok: false,
    });
  });

  it("rejects invalid input", () =>
    expect(runLongestWord(null).ok).toBe(false));
});
