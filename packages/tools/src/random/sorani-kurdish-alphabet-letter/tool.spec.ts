import { describe, expect, it } from "vitest";
import {
  calculateRandomSoraniKurdishAlphabetLetter,
  randomSoraniKurdishAlphabetLetterExample,
  randomSoraniKurdishAlphabetLetterValueCount,
  runRandomSoraniKurdishAlphabetLetter,
} from "./tool.js";

describe("Random Sorani Kurdish Alphabet Letter Generator", () => {
  it("executes the canonical example with injected boundary samples", () => {
    expect(JSON.parse(JSON.stringify(randomSoraniKurdishAlphabetLetterExample))).toEqual(randomSoraniKurdishAlphabetLetterExample);
    expect(runRandomSoraniKurdishAlphabetLetter(randomSoraniKurdishAlphabetLetterExample.input, { random: () => 0 })).toEqual({
      ok: true,
      output: { value: "ئ" },
    });
    expect(runRandomSoraniKurdishAlphabetLetter(randomSoraniKurdishAlphabetLetterExample.input, { random: () => 1 - Number.EPSILON })).toEqual({
      ok: true,
      output: { value: "ێ" },
    });
  });

  it("makes the declared repertoire reachable without weighting gaps", () => {
    const selected = new Set(
      Array.from(
        { length: randomSoraniKurdishAlphabetLetterValueCount },
        (_, index) =>
          calculateRandomSoraniKurdishAlphabetLetter(
            () => (index + 0.5) / randomSoraniKurdishAlphabetLetterValueCount,
          )?.value,
      ),
    );
    expect(selected).not.toContain(undefined);
    expect(selected.size).toBe(randomSoraniKurdishAlphabetLetterValueCount);
  });

  it("rejects invalid random samples and unexpected input", () => {
    for (const sample of [-0.1, 1, Number.NaN, Number.POSITIVE_INFINITY]) {
      expect(runRandomSoraniKurdishAlphabetLetter({}, { random: () => sample })).toMatchObject({
        error: { issues: [{ code: "invalid_random_source" }] },
        ok: false,
      });
    }
    expect(runRandomSoraniKurdishAlphabetLetter({ unexpected: true })).toMatchObject({
      error: { issues: [{ code: "unknown_field", field: "unexpected" }] },
      ok: false,
    });
  });
});
