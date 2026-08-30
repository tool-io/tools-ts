import { describe, expect, it } from "vitest";
import {
  calculateRandomPersianAlphabetLetter,
  randomPersianAlphabetLetterExample,
  randomPersianAlphabetLetterValueCount,
  runRandomPersianAlphabetLetter,
} from "./tool.js";

describe("Random Persian Alphabet Letter Generator", () => {
  it("executes the canonical example with injected boundary samples", () => {
    expect(JSON.parse(JSON.stringify(randomPersianAlphabetLetterExample))).toEqual(randomPersianAlphabetLetterExample);
    expect(runRandomPersianAlphabetLetter(randomPersianAlphabetLetterExample.input, { random: () => 0 })).toEqual({
      ok: true,
      output: { value: "ا" },
    });
    expect(runRandomPersianAlphabetLetter(randomPersianAlphabetLetterExample.input, { random: () => 1 - Number.EPSILON })).toEqual({
      ok: true,
      output: { value: "ی" },
    });
  });

  it("makes the declared repertoire reachable without weighting gaps", () => {
    const selected = new Set(
      Array.from(
        { length: randomPersianAlphabetLetterValueCount },
        (_, index) =>
          calculateRandomPersianAlphabetLetter(
            () => (index + 0.5) / randomPersianAlphabetLetterValueCount,
          )?.value,
      ),
    );
    expect(selected).not.toContain(undefined);
    expect(selected.size).toBe(randomPersianAlphabetLetterValueCount);
  });

  it("rejects invalid random samples and unexpected input", () => {
    for (const sample of [-0.1, 1, Number.NaN, Number.POSITIVE_INFINITY]) {
      expect(runRandomPersianAlphabetLetter({}, { random: () => sample })).toMatchObject({
        error: { issues: [{ code: "invalid_random_source" }] },
        ok: false,
      });
    }
    expect(runRandomPersianAlphabetLetter({ unexpected: true })).toMatchObject({
      error: { issues: [{ code: "unknown_field", field: "unexpected" }] },
      ok: false,
    });
  });
});
