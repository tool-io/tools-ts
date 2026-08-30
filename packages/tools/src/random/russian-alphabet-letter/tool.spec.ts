import { describe, expect, it } from "vitest";
import {
  calculateRandomRussianAlphabetLetter,
  randomRussianAlphabetLetterExample,
  randomRussianAlphabetLetterValueCount,
  runRandomRussianAlphabetLetter,
} from "./tool.js";

describe("Random Russian Alphabet Letter Generator", () => {
  it("executes the canonical example with injected boundary samples", () => {
    expect(JSON.parse(JSON.stringify(randomRussianAlphabetLetterExample))).toEqual(randomRussianAlphabetLetterExample);
    expect(runRandomRussianAlphabetLetter(randomRussianAlphabetLetterExample.input, { random: () => 0 })).toEqual({
      ok: true,
      output: { value: "А" },
    });
    expect(runRandomRussianAlphabetLetter(randomRussianAlphabetLetterExample.input, { random: () => 1 - Number.EPSILON })).toEqual({
      ok: true,
      output: { value: "Я" },
    });
  });

  it("makes the declared repertoire reachable without weighting gaps", () => {
    const selected = new Set(
      Array.from(
        { length: randomRussianAlphabetLetterValueCount },
        (_, index) =>
          calculateRandomRussianAlphabetLetter(
            () => (index + 0.5) / randomRussianAlphabetLetterValueCount,
          )?.value,
      ),
    );
    expect(selected).not.toContain(undefined);
    expect(selected.size).toBe(randomRussianAlphabetLetterValueCount);
  });

  it("rejects invalid random samples and unexpected input", () => {
    for (const sample of [-0.1, 1, Number.NaN, Number.POSITIVE_INFINITY]) {
      expect(runRandomRussianAlphabetLetter({}, { random: () => sample })).toMatchObject({
        error: { issues: [{ code: "invalid_random_source" }] },
        ok: false,
      });
    }
    expect(runRandomRussianAlphabetLetter({ unexpected: true })).toMatchObject({
      error: { issues: [{ code: "unknown_field", field: "unexpected" }] },
      ok: false,
    });
  });
});
