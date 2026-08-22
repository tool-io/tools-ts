import { describe, expect, it } from "vitest";
import { runAverageWordLength } from "./tool.js";

describe("Average Word Length Calculator", () => {
  it("calculates the canonical example", () =>
    expect(runAverageWordLength({ text: "the quick brown fox" })).toEqual({
      ok: true,
      output: { averageLength: 4 },
    }));

  it("returns a fractional mean", () =>
    expect(runAverageWordLength({ text: "ab cde" })).toEqual({
      ok: true,
      output: { averageLength: 2.5 },
    }));

  it("handles a single word", () =>
    expect(runAverageWordLength({ text: "hello" })).toEqual({
      ok: true,
      output: { averageLength: 5 },
    }));

  it("ignores runs of whitespace", () =>
    expect(runAverageWordLength({ text: "  a\tbb\n\nccc  " })).toEqual({
      ok: true,
      output: { averageLength: 2 },
    }));

  it("counts punctuation characters", () =>
    expect(runAverageWordLength({ text: "hi!" })).toEqual({
      ok: true,
      output: { averageLength: 3 },
    }));

  it("rejects empty text with a stable error", () =>
    expect(runAverageWordLength({ text: "" })).toMatchObject({
      error: { issues: [{ code: "empty_text", field: "text" }] },
      ok: false,
    }));

  it("rejects whitespace-only text", () =>
    expect(runAverageWordLength({ text: " \n\t " }).ok).toBe(false));

  it("rejects a missing field", () =>
    expect(runAverageWordLength({}).ok).toBe(false));

  it("rejects non-string input", () =>
    expect(runAverageWordLength({ text: true }).ok).toBe(false));

  it("rejects unknown fields", () =>
    expect(runAverageWordLength({ text: "a b", round: true }).ok).toBe(false));

  it("rejects a null input object", () =>
    expect(runAverageWordLength(null).ok).toBe(false));
});
