import { describe, expect, it } from "vitest";
import {
  calculateRandomArabicBasicAlphabetLetter,
  randomArabicBasicAlphabetLetterExample,
  randomArabicBasicAlphabetLetterValueCount,
  runRandomArabicBasicAlphabetLetter,
} from "./tool.js";

describe("Random Arabic Basic Alphabet Letter Generator", () => {
  it("executes the canonical example with injected boundary samples", () => {
    expect(JSON.parse(JSON.stringify(randomArabicBasicAlphabetLetterExample))).toEqual(randomArabicBasicAlphabetLetterExample);
    expect(runRandomArabicBasicAlphabetLetter(randomArabicBasicAlphabetLetterExample.input, { random: () => 0 })).toEqual({
      ok: true,
      output: { value: "ا" },
    });
    expect(runRandomArabicBasicAlphabetLetter(randomArabicBasicAlphabetLetterExample.input, { random: () => 1 - Number.EPSILON })).toEqual({
      ok: true,
      output: { value: "ي" },
    });
  });

  it("makes the declared repertoire reachable without weighting gaps", () => {
    const selected = new Set(
      Array.from(
        { length: randomArabicBasicAlphabetLetterValueCount },
        (_, index) =>
          calculateRandomArabicBasicAlphabetLetter(
            () => (index + 0.5) / randomArabicBasicAlphabetLetterValueCount,
          )?.value,
      ),
    );
    expect(selected).not.toContain(undefined);
    expect(selected.size).toBe(randomArabicBasicAlphabetLetterValueCount);
  });

  it("rejects invalid random samples and unexpected input", () => {
    for (const sample of [-0.1, 1, Number.NaN, Number.POSITIVE_INFINITY]) {
      expect(runRandomArabicBasicAlphabetLetter({}, { random: () => sample })).toMatchObject({
        error: { issues: [{ code: "invalid_random_source" }] },
        ok: false,
      });
    }
    expect(runRandomArabicBasicAlphabetLetter({ unexpected: true })).toMatchObject({
      error: { issues: [{ code: "unknown_field", field: "unexpected" }] },
      ok: false,
    });
  });
});
