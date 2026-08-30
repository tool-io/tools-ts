import { describe, expect, it } from "vitest";
import {
  calculateRandomHawaiianAlphabetLetter,
  randomHawaiianAlphabetLetterExample,
  randomHawaiianAlphabetLetterValueCount,
  runRandomHawaiianAlphabetLetter,
} from "./tool.js";

describe("Random Hawaiian Alphabet Letter Generator", () => {
  it("executes the canonical example with injected boundary samples", () => {
    expect(JSON.parse(JSON.stringify(randomHawaiianAlphabetLetterExample))).toEqual(randomHawaiianAlphabetLetterExample);
    expect(runRandomHawaiianAlphabetLetter(randomHawaiianAlphabetLetterExample.input, { random: () => 0 })).toEqual({
      ok: true,
      output: { value: "A" },
    });
    expect(runRandomHawaiianAlphabetLetter(randomHawaiianAlphabetLetterExample.input, { random: () => 1 - Number.EPSILON })).toEqual({
      ok: true,
      output: { value: "ʻ" },
    });
  });

  it("makes the declared repertoire reachable without weighting gaps", () => {
    const selected = new Set(
      Array.from(
        { length: randomHawaiianAlphabetLetterValueCount },
        (_, index) =>
          calculateRandomHawaiianAlphabetLetter(
            () => (index + 0.5) / randomHawaiianAlphabetLetterValueCount,
          )?.value,
      ),
    );
    expect(selected).not.toContain(undefined);
    expect(selected.size).toBe(randomHawaiianAlphabetLetterValueCount);
  });

  it("rejects invalid random samples and unexpected input", () => {
    for (const sample of [-0.1, 1, Number.NaN, Number.POSITIVE_INFINITY]) {
      expect(runRandomHawaiianAlphabetLetter({}, { random: () => sample })).toMatchObject({
        error: { issues: [{ code: "invalid_random_source" }] },
        ok: false,
      });
    }
    expect(runRandomHawaiianAlphabetLetter({ unexpected: true })).toMatchObject({
      error: { issues: [{ code: "unknown_field", field: "unexpected" }] },
      ok: false,
    });
  });
});
