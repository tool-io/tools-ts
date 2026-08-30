import { describe, expect, it } from "vitest";
import {
  calculateRandomBulgarianAlphabetLetter,
  randomBulgarianAlphabetLetterExample,
  randomBulgarianAlphabetLetterValueCount,
  runRandomBulgarianAlphabetLetter,
} from "./tool.js";

describe("Random Bulgarian Alphabet Letter Generator", () => {
  it("executes the canonical example with injected boundary samples", () => {
    expect(JSON.parse(JSON.stringify(randomBulgarianAlphabetLetterExample))).toEqual(randomBulgarianAlphabetLetterExample);
    expect(runRandomBulgarianAlphabetLetter(randomBulgarianAlphabetLetterExample.input, { random: () => 0 })).toEqual({
      ok: true,
      output: { value: "А" },
    });
    expect(runRandomBulgarianAlphabetLetter(randomBulgarianAlphabetLetterExample.input, { random: () => 1 - Number.EPSILON })).toEqual({
      ok: true,
      output: { value: "Я" },
    });
  });

  it("makes the declared repertoire reachable without weighting gaps", () => {
    const selected = new Set(
      Array.from(
        { length: randomBulgarianAlphabetLetterValueCount },
        (_, index) =>
          calculateRandomBulgarianAlphabetLetter(
            () => (index + 0.5) / randomBulgarianAlphabetLetterValueCount,
          )?.value,
      ),
    );
    expect(selected).not.toContain(undefined);
    expect(selected.size).toBe(randomBulgarianAlphabetLetterValueCount);
  });

  it("rejects invalid random samples and unexpected input", () => {
    for (const sample of [-0.1, 1, Number.NaN, Number.POSITIVE_INFINITY]) {
      expect(runRandomBulgarianAlphabetLetter({}, { random: () => sample })).toMatchObject({
        error: { issues: [{ code: "invalid_random_source" }] },
        ok: false,
      });
    }
    expect(runRandomBulgarianAlphabetLetter({ unexpected: true })).toMatchObject({
      error: { issues: [{ code: "unknown_field", field: "unexpected" }] },
      ok: false,
    });
  });
});
