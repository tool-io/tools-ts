import { describe, expect, it } from "vitest";
import {
  calculateRandomVietnameseAlphabetLetter,
  randomVietnameseAlphabetLetterExample,
  randomVietnameseAlphabetLetterValueCount,
  runRandomVietnameseAlphabetLetter,
} from "./tool.js";

describe("Random Vietnamese Alphabet Letter Generator", () => {
  it("executes the canonical example with injected boundary samples", () => {
    expect(JSON.parse(JSON.stringify(randomVietnameseAlphabetLetterExample))).toEqual(randomVietnameseAlphabetLetterExample);
    expect(runRandomVietnameseAlphabetLetter(randomVietnameseAlphabetLetterExample.input, { random: () => 0 })).toEqual({
      ok: true,
      output: { value: "A" },
    });
    expect(runRandomVietnameseAlphabetLetter(randomVietnameseAlphabetLetterExample.input, { random: () => 1 - Number.EPSILON })).toEqual({
      ok: true,
      output: { value: "Y" },
    });
  });

  it("makes the declared repertoire reachable without weighting gaps", () => {
    const selected = new Set(
      Array.from(
        { length: randomVietnameseAlphabetLetterValueCount },
        (_, index) =>
          calculateRandomVietnameseAlphabetLetter(
            () => (index + 0.5) / randomVietnameseAlphabetLetterValueCount,
          )?.value,
      ),
    );
    expect(selected).not.toContain(undefined);
    expect(selected.size).toBe(randomVietnameseAlphabetLetterValueCount);
  });

  it("rejects invalid random samples and unexpected input", () => {
    for (const sample of [-0.1, 1, Number.NaN, Number.POSITIVE_INFINITY]) {
      expect(runRandomVietnameseAlphabetLetter({}, { random: () => sample })).toMatchObject({
        error: { issues: [{ code: "invalid_random_source" }] },
        ok: false,
      });
    }
    expect(runRandomVietnameseAlphabetLetter({ unexpected: true })).toMatchObject({
      error: { issues: [{ code: "unknown_field", field: "unexpected" }] },
      ok: false,
    });
  });
});
