import { describe, expect, it } from "vitest";
import { consonantVowelRatioExample, runConsonantVowelRatio } from "./tool.js";

describe("Consonant-Vowel Ratio Calculator", () => {
  it("calculates the canonical example", () =>
    expect(runConsonantVowelRatio(consonantVowelRatioExample.input)).toEqual({
      ok: true,
      output: consonantVowelRatioExample.output,
    }));
  it("is case-insensitive and ignores non-letters", () =>
    expect(runConsonantVowelRatio({ text: "A b c! 42" })).toEqual({
      ok: true,
      output: { ratio: 2 },
    }));
  it("treats y as a consonant", () =>
    expect(runConsonantVowelRatio({ text: "Yay" })).toEqual({
      ok: true,
      output: { ratio: 2 },
    }));
  it("allows zero consonants", () =>
    expect(runConsonantVowelRatio({ text: "aeiou AEIOU" })).toEqual({
      ok: true,
      output: { ratio: 0 },
    }));
  it("ignores accented letters outside ASCII", () =>
    expect(runConsonantVowelRatio({ text: "café" })).toEqual({
      ok: true,
      output: { ratio: 2 },
    }));
  it("rejects text with no vowel letters", () => {
    expect(runConsonantVowelRatio({ text: "Rhythm" }).ok).toBe(false);
    expect(runConsonantVowelRatio({ text: "123 ?!" }).ok).toBe(false);
    expect(runConsonantVowelRatio({ text: "" }).ok).toBe(false);
  });
  it("rejects malformed input", () => {
    expect(runConsonantVowelRatio(null).ok).toBe(false);
    expect(runConsonantVowelRatio({}).ok).toBe(false);
    expect(runConsonantVowelRatio({ text: true }).ok).toBe(false);
  });
});
