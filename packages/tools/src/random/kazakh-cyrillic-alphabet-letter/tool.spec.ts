import { describe, expect, it } from "vitest";
import {
  calculateRandomKazakhCyrillicAlphabetLetter,
  randomKazakhCyrillicAlphabetLetterExample,
  randomKazakhCyrillicAlphabetLetterValueCount,
  runRandomKazakhCyrillicAlphabetLetter,
} from "./tool.js";

describe("Random Kazakh Cyrillic Alphabet Letter Generator", () => {
  it("executes the canonical example with injected boundary samples", () => {
    expect(JSON.parse(JSON.stringify(randomKazakhCyrillicAlphabetLetterExample))).toEqual(randomKazakhCyrillicAlphabetLetterExample);
    expect(runRandomKazakhCyrillicAlphabetLetter(randomKazakhCyrillicAlphabetLetterExample.input, { random: () => 0 })).toEqual({
      ok: true,
      output: { value: "А" },
    });
    expect(runRandomKazakhCyrillicAlphabetLetter(randomKazakhCyrillicAlphabetLetterExample.input, { random: () => 1 - Number.EPSILON })).toEqual({
      ok: true,
      output: { value: "Я" },
    });
  });

  it("makes the declared repertoire reachable without weighting gaps", () => {
    const selected = new Set(
      Array.from(
        { length: randomKazakhCyrillicAlphabetLetterValueCount },
        (_, index) =>
          calculateRandomKazakhCyrillicAlphabetLetter(
            () => (index + 0.5) / randomKazakhCyrillicAlphabetLetterValueCount,
          )?.value,
      ),
    );
    expect(selected).not.toContain(undefined);
    expect(selected.size).toBe(randomKazakhCyrillicAlphabetLetterValueCount);
  });

  it("rejects invalid random samples and unexpected input", () => {
    for (const sample of [-0.1, 1, Number.NaN, Number.POSITIVE_INFINITY]) {
      expect(runRandomKazakhCyrillicAlphabetLetter({}, { random: () => sample })).toMatchObject({
        error: { issues: [{ code: "invalid_random_source" }] },
        ok: false,
      });
    }
    expect(runRandomKazakhCyrillicAlphabetLetter({ unexpected: true })).toMatchObject({
      error: { issues: [{ code: "unknown_field", field: "unexpected" }] },
      ok: false,
    });
  });
});
