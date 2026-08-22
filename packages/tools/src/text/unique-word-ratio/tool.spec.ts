import { describe, expect, it } from "vitest";
import { runUniqueWordRatio } from "./tool.js";

describe("Unique Word Ratio Calculator", () => {
  it("calculates the canonical example", () =>
    expect(
      runUniqueWordRatio({ text: "Hello hello world world world" }),
    ).toEqual({
      ok: true,
      output: { ratio: 0.4 },
    }));

  it("returns one for fully unique text", () =>
    expect(runUniqueWordRatio({ text: "alpha beta gamma" })).toEqual({
      ok: true,
      output: { ratio: 1 },
    }));

  it("compares words case-insensitively", () =>
    expect(runUniqueWordRatio({ text: "Cat cat CAT dog" })).toEqual({
      ok: true,
      output: { ratio: 0.5 },
    }));

  it("returns a quarter for one unique word of four", () =>
    expect(runUniqueWordRatio({ text: "same same SAME same" })).toEqual({
      ok: true,
      output: { ratio: 0.25 },
    }));

  it("keeps punctuation distinct from bare words", () =>
    expect(runUniqueWordRatio({ text: "fox, fox" })).toEqual({
      ok: true,
      output: { ratio: 1 },
    }));

  it("returns one for a single word", () =>
    expect(runUniqueWordRatio({ text: "solo" })).toEqual({
      ok: true,
      output: { ratio: 1 },
    }));

  it("ignores runs of whitespace when counting", () =>
    expect(runUniqueWordRatio({ text: "  a\ta\nb\n\nb  " })).toEqual({
      ok: true,
      output: { ratio: 0.5 },
    }));

  it("rejects empty text with a stable error", () =>
    expect(runUniqueWordRatio({ text: "" })).toMatchObject({
      error: { issues: [{ code: "empty_text", field: "text" }] },
      ok: false,
    }));

  it("rejects whitespace-only text", () =>
    expect(runUniqueWordRatio({ text: "\t \n" }).ok).toBe(false));

  it("rejects a missing field", () =>
    expect(runUniqueWordRatio({}).ok).toBe(false));

  it("rejects non-string input", () =>
    expect(runUniqueWordRatio({ text: 0.5 }).ok).toBe(false));

  it("rejects unknown fields", () =>
    expect(runUniqueWordRatio({ text: "a b", foldCase: true }).ok).toBe(false));

  it("rejects a null input object", () =>
    expect(runUniqueWordRatio(null).ok).toBe(false));
});
