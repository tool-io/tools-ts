import { describe, expect, it } from "vitest";
import {
  calculateRandomUkrainianAlphabetLetter,
  randomUkrainianAlphabetLetterExample,
  randomUkrainianAlphabetLetterValueCount,
  runRandomUkrainianAlphabetLetter,
} from "./tool.js";

describe("Random Ukrainian Alphabet Letter Generator", () => {
  it("executes the canonical example with injected boundary samples", () => {
    expect(JSON.parse(JSON.stringify(randomUkrainianAlphabetLetterExample))).toEqual(randomUkrainianAlphabetLetterExample);
    expect(runRandomUkrainianAlphabetLetter(randomUkrainianAlphabetLetterExample.input, { random: () => 0 })).toEqual({
      ok: true,
      output: { value: "А" },
    });
    expect(runRandomUkrainianAlphabetLetter(randomUkrainianAlphabetLetterExample.input, { random: () => 1 - Number.EPSILON })).toEqual({
      ok: true,
      output: { value: "Я" },
    });
  });

  it("makes the declared repertoire reachable without weighting gaps", () => {
    const selected = new Set(
      Array.from(
        { length: randomUkrainianAlphabetLetterValueCount },
        (_, index) =>
          calculateRandomUkrainianAlphabetLetter(
            () => (index + 0.5) / randomUkrainianAlphabetLetterValueCount,
          )?.value,
      ),
    );
    expect(selected).not.toContain(undefined);
    expect(selected.size).toBe(randomUkrainianAlphabetLetterValueCount);
  });

  it("rejects invalid random samples and unexpected input", () => {
    for (const sample of [-0.1, 1, Number.NaN, Number.POSITIVE_INFINITY]) {
      expect(runRandomUkrainianAlphabetLetter({}, { random: () => sample })).toMatchObject({
        error: { issues: [{ code: "invalid_random_source" }] },
        ok: false,
      });
    }
    expect(runRandomUkrainianAlphabetLetter({ unexpected: true })).toMatchObject({
      error: { issues: [{ code: "unknown_field", field: "unexpected" }] },
      ok: false,
    });
  });
});
