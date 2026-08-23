import { describe, expect, it } from "vitest";
import { runRemovePunctuation } from "./tool.js";

describe("Remove Punctuation Tool", () => {
  it("calculates the canonical example", () =>
    expect(runRemovePunctuation({ text: "Hello, world!" })).toEqual({
      ok: true,
      output: { result: "Hello world" },
    }));

  it("removes ASCII punctuation of every kind", () =>
    expect(runRemovePunctuation({ text: "a-b_c\"d'e(f)g[h]i{j}k" })).toEqual({
      ok: true,
      output: { result: "abcdefghijk" },
    }));

  it("removes Unicode punctuation such as quotes and dashes", () =>
    expect(
      runRemovePunctuation({ text: "\u201cquote\u201d \u2014 dash\u2026" }),
    ).toEqual({
      ok: true,
      output: { result: "quote  dash" },
    }));

  it("keeps accented letters like é and ñ", () =>
    expect(runRemovePunctuation({ text: "café niño?" })).toEqual({
      ok: true,
      output: { result: "café niño" },
    }));

  it("keeps digits, symbols and whitespace", () =>
    expect(runRemovePunctuation({ text: "$100 + 50 = 150" })).toEqual({
      ok: true,
      output: { result: "$100 + 50 = 150" },
    }));

  it("keeps emoji", () =>
    expect(runRemovePunctuation({ text: "Great! 🎉" })).toEqual({
      ok: true,
      output: { result: "Great 🎉" },
    }));

  it("returns an empty string for empty text", () =>
    expect(runRemovePunctuation({ text: "" })).toEqual({
      ok: true,
      output: { result: "" },
    }));

  it("returns an empty string for punctuation-only text", () =>
    expect(runRemovePunctuation({ text: "?!.,;:" })).toEqual({
      ok: true,
      output: { result: "" },
    }));

  it("rejects a missing field", () =>
    expect(runRemovePunctuation({}).ok).toBe(false));

  it("rejects non-string input", () =>
    expect(runRemovePunctuation({ text: 3 }).ok).toBe(false));

  it("rejects unknown fields", () =>
    expect(runRemovePunctuation({ text: "a", extra: true }).ok).toBe(false));
});
