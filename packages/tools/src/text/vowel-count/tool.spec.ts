import { describe, expect, it } from "vitest";
import { runVowelCount } from "./tool.js";

describe("Vowel Count Tool", () => {
  it("calculates the canonical example", () =>
    expect(runVowelCount({ text: "Hello World" })).toEqual({
      ok: true,
      output: { vowelCount: 3 },
    }));

  it("counts vowels case-insensitively", () =>
    expect(runVowelCount({ text: "AEiou" })).toEqual({
      ok: true,
      output: { vowelCount: 5 },
    }));

  it("counts zero when there are no vowels", () =>
    expect(runVowelCount({ text: "rhythm" })).toEqual({
      ok: true,
      output: { vowelCount: 0 },
    }));

  it("does not count accented letters as vowels", () =>
    expect(runVowelCount({ text: "café ÉÀØ" })).toEqual({
      ok: true,
      output: { vowelCount: 1 },
    }));

  it("ignores digits and punctuation", () =>
    expect(runVowelCount({ text: "a1e2!?" })).toEqual({
      ok: true,
      output: { vowelCount: 2 },
    }));

  it("counts zero for empty text", () =>
    expect(runVowelCount({ text: "" })).toEqual({
      ok: true,
      output: { vowelCount: 0 },
    }));

  it("rejects a missing field", () => expect(runVowelCount({}).ok).toBe(false));

  it("rejects non-string input", () =>
    expect(runVowelCount({ text: 7 }).ok).toBe(false));

  it("rejects unknown fields", () =>
    expect(runVowelCount({ text: "a", extra: 1 }).ok).toBe(false));

  it("rejects a null input object", () =>
    expect(runVowelCount(null).ok).toBe(false));
});
