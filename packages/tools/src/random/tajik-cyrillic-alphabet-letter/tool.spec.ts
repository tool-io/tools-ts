import { describe, expect, it } from "vitest";
import {
  calculateRandomTajikCyrillicAlphabetLetter,
  randomTajikCyrillicAlphabetLetterExample,
  randomTajikCyrillicAlphabetLetterValueCount,
  runRandomTajikCyrillicAlphabetLetter,
} from "./tool.js";

describe("Random Tajik Cyrillic Alphabet Letter Generator", () => {
  it("executes the canonical example with injected boundary samples", () => {
    expect(JSON.parse(JSON.stringify(randomTajikCyrillicAlphabetLetterExample))).toEqual(randomTajikCyrillicAlphabetLetterExample);
    expect(runRandomTajikCyrillicAlphabetLetter(randomTajikCyrillicAlphabetLetterExample.input, { random: () => 0 })).toEqual({
      ok: true,
      output: { value: "А" },
    });
    expect(runRandomTajikCyrillicAlphabetLetter(randomTajikCyrillicAlphabetLetterExample.input, { random: () => 1 - Number.EPSILON })).toEqual({
      ok: true,
      output: { value: "Я" },
    });
  });

  it("makes the declared repertoire reachable without weighting gaps", () => {
    const selected = new Set(
      Array.from(
        { length: randomTajikCyrillicAlphabetLetterValueCount },
        (_, index) =>
          calculateRandomTajikCyrillicAlphabetLetter(
            () => (index + 0.5) / randomTajikCyrillicAlphabetLetterValueCount,
          )?.value,
      ),
    );
    expect(selected).not.toContain(undefined);
    expect(selected.size).toBe(randomTajikCyrillicAlphabetLetterValueCount);
  });

  it("rejects invalid random samples and unexpected input", () => {
    for (const sample of [-0.1, 1, Number.NaN, Number.POSITIVE_INFINITY]) {
      expect(runRandomTajikCyrillicAlphabetLetter({}, { random: () => sample })).toMatchObject({
        error: { issues: [{ code: "invalid_random_source" }] },
        ok: false,
      });
    }
    expect(runRandomTajikCyrillicAlphabetLetter({ unexpected: true })).toMatchObject({
      error: { issues: [{ code: "unknown_field", field: "unexpected" }] },
      ok: false,
    });
  });
});
