import { describe, expect, it } from "vitest";
import {
  calculateRandomTurkishAlphabetLetter,
  randomTurkishAlphabetLetterExample,
  randomTurkishAlphabetLetterValueCount,
  runRandomTurkishAlphabetLetter,
} from "./tool.js";

describe("Random Turkish Alphabet Letter Generator", () => {
  it("executes the canonical example with injected boundary samples", () => {
    expect(JSON.parse(JSON.stringify(randomTurkishAlphabetLetterExample))).toEqual(randomTurkishAlphabetLetterExample);
    expect(runRandomTurkishAlphabetLetter(randomTurkishAlphabetLetterExample.input, { random: () => 0 })).toEqual({
      ok: true,
      output: { value: "A" },
    });
    expect(runRandomTurkishAlphabetLetter(randomTurkishAlphabetLetterExample.input, { random: () => 1 - Number.EPSILON })).toEqual({
      ok: true,
      output: { value: "Z" },
    });
  });

  it("makes the declared repertoire reachable without weighting gaps", () => {
    const selected = new Set(
      Array.from(
        { length: randomTurkishAlphabetLetterValueCount },
        (_, index) =>
          calculateRandomTurkishAlphabetLetter(
            () => (index + 0.5) / randomTurkishAlphabetLetterValueCount,
          )?.value,
      ),
    );
    expect(selected).not.toContain(undefined);
    expect(selected.size).toBe(randomTurkishAlphabetLetterValueCount);
  });

  it("rejects invalid random samples and unexpected input", () => {
    for (const sample of [-0.1, 1, Number.NaN, Number.POSITIVE_INFINITY]) {
      expect(runRandomTurkishAlphabetLetter({}, { random: () => sample })).toMatchObject({
        error: { issues: [{ code: "invalid_random_source" }] },
        ok: false,
      });
    }
    expect(runRandomTurkishAlphabetLetter({ unexpected: true })).toMatchObject({
      error: { issues: [{ code: "unknown_field", field: "unexpected" }] },
      ok: false,
    });
  });
});
