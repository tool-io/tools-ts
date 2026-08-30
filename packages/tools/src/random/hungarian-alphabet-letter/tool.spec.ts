import { describe, expect, it } from "vitest";
import {
  calculateRandomHungarianAlphabetLetter,
  randomHungarianAlphabetLetterExample,
  randomHungarianAlphabetLetterValueCount,
  runRandomHungarianAlphabetLetter,
} from "./tool.js";

describe("Random Hungarian Alphabet Letter Generator", () => {
  it("executes the canonical example with injected boundary samples", () => {
    expect(JSON.parse(JSON.stringify(randomHungarianAlphabetLetterExample))).toEqual(randomHungarianAlphabetLetterExample);
    expect(runRandomHungarianAlphabetLetter(randomHungarianAlphabetLetterExample.input, { random: () => 0 })).toEqual({
      ok: true,
      output: { value: "A" },
    });
    expect(runRandomHungarianAlphabetLetter(randomHungarianAlphabetLetterExample.input, { random: () => 1 - Number.EPSILON })).toEqual({
      ok: true,
      output: { value: "Zs" },
    });
  });

  it("makes the declared repertoire reachable without weighting gaps", () => {
    const selected = new Set(
      Array.from(
        { length: randomHungarianAlphabetLetterValueCount },
        (_, index) =>
          calculateRandomHungarianAlphabetLetter(
            () => (index + 0.5) / randomHungarianAlphabetLetterValueCount,
          )?.value,
      ),
    );
    expect(selected).not.toContain(undefined);
    expect(selected.size).toBe(randomHungarianAlphabetLetterValueCount);
  });

  it("rejects invalid random samples and unexpected input", () => {
    for (const sample of [-0.1, 1, Number.NaN, Number.POSITIVE_INFINITY]) {
      expect(runRandomHungarianAlphabetLetter({}, { random: () => sample })).toMatchObject({
        error: { issues: [{ code: "invalid_random_source" }] },
        ok: false,
      });
    }
    expect(runRandomHungarianAlphabetLetter({ unexpected: true })).toMatchObject({
      error: { issues: [{ code: "unknown_field", field: "unexpected" }] },
      ok: false,
    });
  });
});
