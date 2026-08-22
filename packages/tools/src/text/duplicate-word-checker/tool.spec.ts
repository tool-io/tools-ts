import { describe, expect, it } from "vitest";
import { runDuplicateWordChecker } from "./tool.js";

describe("Duplicate Word Checker", () => {
  it("calculates the canonical example", () =>
    expect(
      runDuplicateWordChecker({
        text: "The quick brown fox jumps over the lazy dog",
      }),
    ).toEqual({ ok: true, output: { hasDuplicates: true } }));

  it("reports false when every word is unique", () =>
    expect(runDuplicateWordChecker({ text: "alpha beta gamma" })).toEqual({
      ok: true,
      output: { hasDuplicates: false },
    }));

  it("ignores case when comparing words", () =>
    expect(runDuplicateWordChecker({ text: "The THE the" })).toEqual({
      ok: true,
      output: { hasDuplicates: true },
    }));

  it("splits on any whitespace including tabs and newlines", () =>
    expect(runDuplicateWordChecker({ text: "one\ttwo\nthree one" })).toEqual({
      ok: true,
      output: { hasDuplicates: true },
    }));

  it("reports false for a single word", () =>
    expect(runDuplicateWordChecker({ text: "solo" })).toEqual({
      ok: true,
      output: { hasDuplicates: false },
    }));

  it("reports false for whitespace-only text by rule", () =>
    expect(runDuplicateWordChecker({ text: "   \n\t " })).toEqual({
      ok: true,
      output: { hasDuplicates: false },
    }));

  it("distinguishes differently-cased unique words", () =>
    expect(runDuplicateWordChecker({ text: "Dog dog" }).ok).toBe(true));

  it("rejects a missing field", () =>
    expect(runDuplicateWordChecker({}).ok).toBe(false));

  it("rejects non-string input", () =>
    expect(runDuplicateWordChecker({ text: ["a", "a"] }).ok).toBe(false));

  it("rejects unknown fields", () =>
    expect(runDuplicateWordChecker({ text: "a b", words: ["a"] }).ok).toBe(
      false,
    ));

  it("rejects a null input object", () =>
    expect(runDuplicateWordChecker(null).ok).toBe(false));
});
