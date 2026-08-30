import { describe, expect, it } from "vitest";
import {
  calculateRandomUyghurArabicAlphabetLetter,
  randomUyghurArabicAlphabetLetterExample,
  randomUyghurArabicAlphabetLetterValueCount,
  runRandomUyghurArabicAlphabetLetter,
} from "./tool.js";

describe("Random Uyghur Arabic Alphabet Letter Generator", () => {
  it("executes the canonical example with injected boundary samples", () => {
    expect(JSON.parse(JSON.stringify(randomUyghurArabicAlphabetLetterExample))).toEqual(randomUyghurArabicAlphabetLetterExample);
    expect(runRandomUyghurArabicAlphabetLetter(randomUyghurArabicAlphabetLetterExample.input, { random: () => 0 })).toEqual({
      ok: true,
      output: { value: "ا" },
    });
    expect(runRandomUyghurArabicAlphabetLetter(randomUyghurArabicAlphabetLetterExample.input, { random: () => 1 - Number.EPSILON })).toEqual({
      ok: true,
      output: { value: "ي" },
    });
  });

  it("makes the declared repertoire reachable without weighting gaps", () => {
    const selected = new Set(
      Array.from(
        { length: randomUyghurArabicAlphabetLetterValueCount },
        (_, index) =>
          calculateRandomUyghurArabicAlphabetLetter(
            () => (index + 0.5) / randomUyghurArabicAlphabetLetterValueCount,
          )?.value,
      ),
    );
    expect(selected).not.toContain(undefined);
    expect(selected.size).toBe(randomUyghurArabicAlphabetLetterValueCount);
  });

  it("rejects invalid random samples and unexpected input", () => {
    for (const sample of [-0.1, 1, Number.NaN, Number.POSITIVE_INFINITY]) {
      expect(runRandomUyghurArabicAlphabetLetter({}, { random: () => sample })).toMatchObject({
        error: { issues: [{ code: "invalid_random_source" }] },
        ok: false,
      });
    }
    expect(runRandomUyghurArabicAlphabetLetter({ unexpected: true })).toMatchObject({
      error: { issues: [{ code: "unknown_field", field: "unexpected" }] },
      ok: false,
    });
  });
});
