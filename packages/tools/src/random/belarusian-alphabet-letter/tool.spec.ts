import { describe, expect, it } from "vitest";
import {
  calculateRandomBelarusianAlphabetLetter,
  randomBelarusianAlphabetLetterExample,
  randomBelarusianAlphabetLetterValueCount,
  runRandomBelarusianAlphabetLetter,
} from "./tool.js";

describe("Random Belarusian Alphabet Letter Generator", () => {
  it("executes the canonical example with injected boundary samples", () => {
    expect(JSON.parse(JSON.stringify(randomBelarusianAlphabetLetterExample))).toEqual(randomBelarusianAlphabetLetterExample);
    expect(runRandomBelarusianAlphabetLetter(randomBelarusianAlphabetLetterExample.input, { random: () => 0 })).toEqual({
      ok: true,
      output: { value: "А" },
    });
    expect(runRandomBelarusianAlphabetLetter(randomBelarusianAlphabetLetterExample.input, { random: () => 1 - Number.EPSILON })).toEqual({
      ok: true,
      output: { value: "Я" },
    });
  });

  it("makes the declared repertoire reachable without weighting gaps", () => {
    const selected = new Set(
      Array.from(
        { length: randomBelarusianAlphabetLetterValueCount },
        (_, index) =>
          calculateRandomBelarusianAlphabetLetter(
            () => (index + 0.5) / randomBelarusianAlphabetLetterValueCount,
          )?.value,
      ),
    );
    expect(selected).not.toContain(undefined);
    expect(selected.size).toBe(randomBelarusianAlphabetLetterValueCount);
  });

  it("rejects invalid random samples and unexpected input", () => {
    for (const sample of [-0.1, 1, Number.NaN, Number.POSITIVE_INFINITY]) {
      expect(runRandomBelarusianAlphabetLetter({}, { random: () => sample })).toMatchObject({
        error: { issues: [{ code: "invalid_random_source" }] },
        ok: false,
      });
    }
    expect(runRandomBelarusianAlphabetLetter({ unexpected: true })).toMatchObject({
      error: { issues: [{ code: "unknown_field", field: "unexpected" }] },
      ok: false,
    });
  });
});
