import { describe, expect, it } from "vitest";
import {
  calculateRandomSindhiArabicAlphabetLetter,
  randomSindhiArabicAlphabetLetterExample,
  randomSindhiArabicAlphabetLetterValueCount,
  runRandomSindhiArabicAlphabetLetter,
} from "./tool.js";

describe("Random Sindhi Arabic Alphabet Letter Generator", () => {
  it("executes the canonical example with injected boundary samples", () => {
    expect(JSON.parse(JSON.stringify(randomSindhiArabicAlphabetLetterExample))).toEqual(randomSindhiArabicAlphabetLetterExample);
    expect(runRandomSindhiArabicAlphabetLetter(randomSindhiArabicAlphabetLetterExample.input, { random: () => 0 })).toEqual({
      ok: true,
      output: { value: "ا" },
    });
    expect(runRandomSindhiArabicAlphabetLetter(randomSindhiArabicAlphabetLetterExample.input, { random: () => 1 - Number.EPSILON })).toEqual({
      ok: true,
      output: { value: "ې" },
    });
  });

  it("makes the declared repertoire reachable without weighting gaps", () => {
    const selected = new Set(
      Array.from(
        { length: randomSindhiArabicAlphabetLetterValueCount },
        (_, index) =>
          calculateRandomSindhiArabicAlphabetLetter(
            () => (index + 0.5) / randomSindhiArabicAlphabetLetterValueCount,
          )?.value,
      ),
    );
    expect(selected).not.toContain(undefined);
    expect(selected.size).toBe(randomSindhiArabicAlphabetLetterValueCount);
  });

  it("rejects invalid random samples and unexpected input", () => {
    for (const sample of [-0.1, 1, Number.NaN, Number.POSITIVE_INFINITY]) {
      expect(runRandomSindhiArabicAlphabetLetter({}, { random: () => sample })).toMatchObject({
        error: { issues: [{ code: "invalid_random_source" }] },
        ok: false,
      });
    }
    expect(runRandomSindhiArabicAlphabetLetter({ unexpected: true })).toMatchObject({
      error: { issues: [{ code: "unknown_field", field: "unexpected" }] },
      ok: false,
    });
  });
});
