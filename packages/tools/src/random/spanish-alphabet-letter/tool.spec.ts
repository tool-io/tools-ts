import { describe, expect, it } from "vitest";
import {
  calculateRandomSpanishAlphabetLetter,
  randomSpanishAlphabetLetterExample,
  randomSpanishAlphabetLetterValueCount,
  runRandomSpanishAlphabetLetter,
} from "./tool.js";

describe("Random Spanish Alphabet Letter Generator", () => {
  it("executes the canonical example with injected boundary samples", () => {
    expect(JSON.parse(JSON.stringify(randomSpanishAlphabetLetterExample))).toEqual(randomSpanishAlphabetLetterExample);
    expect(runRandomSpanishAlphabetLetter(randomSpanishAlphabetLetterExample.input, { random: () => 0 })).toEqual({
      ok: true,
      output: { value: "A" },
    });
    expect(runRandomSpanishAlphabetLetter(randomSpanishAlphabetLetterExample.input, { random: () => 1 - Number.EPSILON })).toEqual({
      ok: true,
      output: { value: "Z" },
    });
  });

  it("makes the declared repertoire reachable without weighting gaps", () => {
    const selected = new Set(
      Array.from(
        { length: randomSpanishAlphabetLetterValueCount },
        (_, index) =>
          calculateRandomSpanishAlphabetLetter(
            () => (index + 0.5) / randomSpanishAlphabetLetterValueCount,
          )?.value,
      ),
    );
    expect(selected).not.toContain(undefined);
    expect(selected.size).toBe(randomSpanishAlphabetLetterValueCount);
  });

  it("rejects invalid random samples and unexpected input", () => {
    for (const sample of [-0.1, 1, Number.NaN, Number.POSITIVE_INFINITY]) {
      expect(runRandomSpanishAlphabetLetter({}, { random: () => sample })).toMatchObject({
        error: { issues: [{ code: "invalid_random_source" }] },
        ok: false,
      });
    }
    expect(runRandomSpanishAlphabetLetter({ unexpected: true })).toMatchObject({
      error: { issues: [{ code: "unknown_field", field: "unexpected" }] },
      ok: false,
    });
  });
});
