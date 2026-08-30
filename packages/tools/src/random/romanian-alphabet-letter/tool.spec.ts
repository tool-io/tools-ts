import { describe, expect, it } from "vitest";
import {
  calculateRandomRomanianAlphabetLetter,
  randomRomanianAlphabetLetterExample,
  randomRomanianAlphabetLetterValueCount,
  runRandomRomanianAlphabetLetter,
} from "./tool.js";

describe("Random Romanian Alphabet Letter Generator", () => {
  it("executes the canonical example with injected boundary samples", () => {
    expect(JSON.parse(JSON.stringify(randomRomanianAlphabetLetterExample))).toEqual(randomRomanianAlphabetLetterExample);
    expect(runRandomRomanianAlphabetLetter(randomRomanianAlphabetLetterExample.input, { random: () => 0 })).toEqual({
      ok: true,
      output: { value: "A" },
    });
    expect(runRandomRomanianAlphabetLetter(randomRomanianAlphabetLetterExample.input, { random: () => 1 - Number.EPSILON })).toEqual({
      ok: true,
      output: { value: "Z" },
    });
  });

  it("makes the declared repertoire reachable without weighting gaps", () => {
    const selected = new Set(
      Array.from(
        { length: randomRomanianAlphabetLetterValueCount },
        (_, index) =>
          calculateRandomRomanianAlphabetLetter(
            () => (index + 0.5) / randomRomanianAlphabetLetterValueCount,
          )?.value,
      ),
    );
    expect(selected).not.toContain(undefined);
    expect(selected.size).toBe(randomRomanianAlphabetLetterValueCount);
  });

  it("rejects invalid random samples and unexpected input", () => {
    for (const sample of [-0.1, 1, Number.NaN, Number.POSITIVE_INFINITY]) {
      expect(runRandomRomanianAlphabetLetter({}, { random: () => sample })).toMatchObject({
        error: { issues: [{ code: "invalid_random_source" }] },
        ok: false,
      });
    }
    expect(runRandomRomanianAlphabetLetter({ unexpected: true })).toMatchObject({
      error: { issues: [{ code: "unknown_field", field: "unexpected" }] },
      ok: false,
    });
  });
});
