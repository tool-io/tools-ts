import { describe, expect, it } from "vitest";
import { runShortestWord } from "./tool.js";

describe("Shortest Word Finder", () => {
  it("calculates the canonical example", () =>
    expect(runShortestWord({ text: "I love functional programming" })).toEqual({
      ok: true,
      output: { length: 1, word: "I" },
    }));

  it("returns the first shortest word on ties", () =>
    expect(runShortestWord({ text: "cat dog bird fish" })).toEqual({
      ok: true,
      output: { length: 3, word: "cat" },
    }));

  it("treats punctuation as part of a word", () =>
    expect(runShortestWord({ text: "hello, world" })).toEqual({
      ok: true,
      output: { length: 5, word: "world" },
    }));

  it("handles accented letters by code unit length", () =>
    expect(runShortestWord({ text: "café au" })).toEqual({
      ok: true,
      output: { length: 2, word: "au" },
    }));

  it("returns a single word unchanged", () =>
    expect(runShortestWord({ text: "extraordinarily" })).toEqual({
      ok: true,
      output: { length: 15, word: "extraordinarily" },
    }));

  it("ignores runs of whitespace", () =>
    expect(runShortestWord({ text: "  deep\t\ndark\n\nblue  " })).toEqual({
      ok: true,
      output: { length: 4, word: "deep" },
    }));

  it("rejects empty text with a stable error", () =>
    expect(runShortestWord({ text: "" })).toMatchObject({
      error: { issues: [{ code: "empty_text", field: "text" }] },
      ok: false,
    }));

  it("rejects whitespace-only text", () =>
    expect(runShortestWord({ text: " \t \n " }).ok).toBe(false));

  it("rejects a missing field", () =>
    expect(runShortestWord({}).ok).toBe(false));

  it("rejects non-string input", () =>
    expect(runShortestWord({ text: ["a"] }).ok).toBe(false));

  it("rejects unknown fields", () =>
    expect(runShortestWord({ text: "a b", mode: "first" }).ok).toBe(false));

  it("rejects a null input object", () =>
    expect(runShortestWord(null).ok).toBe(false));
});
