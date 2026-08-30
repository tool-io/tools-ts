import { describe, expect, it } from "vitest";
import {
  calculateRandomLithuanianAlphabetLetter,
  randomLithuanianAlphabetLetterExample,
  randomLithuanianAlphabetLetterValueCount,
  runRandomLithuanianAlphabetLetter,
} from "./tool.js";

describe("Random Lithuanian Alphabet Letter Generator", () => {
  it("executes the canonical example with injected boundary samples", () => {
    expect(JSON.parse(JSON.stringify(randomLithuanianAlphabetLetterExample))).toEqual(randomLithuanianAlphabetLetterExample);
    expect(runRandomLithuanianAlphabetLetter(randomLithuanianAlphabetLetterExample.input, { random: () => 0 })).toEqual({
      ok: true,
      output: { value: "A" },
    });
    expect(runRandomLithuanianAlphabetLetter(randomLithuanianAlphabetLetterExample.input, { random: () => 1 - Number.EPSILON })).toEqual({
      ok: true,
      output: { value: "Ž" },
    });
  });

  it("makes the declared repertoire reachable without weighting gaps", () => {
    const selected = new Set(
      Array.from(
        { length: randomLithuanianAlphabetLetterValueCount },
        (_, index) =>
          calculateRandomLithuanianAlphabetLetter(
            () => (index + 0.5) / randomLithuanianAlphabetLetterValueCount,
          )?.value,
      ),
    );
    expect(selected).not.toContain(undefined);
    expect(selected.size).toBe(randomLithuanianAlphabetLetterValueCount);
  });

  it("rejects invalid random samples and unexpected input", () => {
    for (const sample of [-0.1, 1, Number.NaN, Number.POSITIVE_INFINITY]) {
      expect(runRandomLithuanianAlphabetLetter({}, { random: () => sample })).toMatchObject({
        error: { issues: [{ code: "invalid_random_source" }] },
        ok: false,
      });
    }
    expect(runRandomLithuanianAlphabetLetter({ unexpected: true })).toMatchObject({
      error: { issues: [{ code: "unknown_field", field: "unexpected" }] },
      ok: false,
    });
  });
});
