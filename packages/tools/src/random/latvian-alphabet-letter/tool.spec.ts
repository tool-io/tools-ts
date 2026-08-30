import { describe, expect, it } from "vitest";
import {
  calculateRandomLatvianAlphabetLetter,
  randomLatvianAlphabetLetterExample,
  randomLatvianAlphabetLetterValueCount,
  runRandomLatvianAlphabetLetter,
} from "./tool.js";

describe("Random Latvian Alphabet Letter Generator", () => {
  it("executes the canonical example with injected boundary samples", () => {
    expect(JSON.parse(JSON.stringify(randomLatvianAlphabetLetterExample))).toEqual(randomLatvianAlphabetLetterExample);
    expect(runRandomLatvianAlphabetLetter(randomLatvianAlphabetLetterExample.input, { random: () => 0 })).toEqual({
      ok: true,
      output: { value: "A" },
    });
    expect(runRandomLatvianAlphabetLetter(randomLatvianAlphabetLetterExample.input, { random: () => 1 - Number.EPSILON })).toEqual({
      ok: true,
      output: { value: "Ž" },
    });
  });

  it("makes the declared repertoire reachable without weighting gaps", () => {
    const selected = new Set(
      Array.from(
        { length: randomLatvianAlphabetLetterValueCount },
        (_, index) =>
          calculateRandomLatvianAlphabetLetter(
            () => (index + 0.5) / randomLatvianAlphabetLetterValueCount,
          )?.value,
      ),
    );
    expect(selected).not.toContain(undefined);
    expect(selected.size).toBe(randomLatvianAlphabetLetterValueCount);
  });

  it("rejects invalid random samples and unexpected input", () => {
    for (const sample of [-0.1, 1, Number.NaN, Number.POSITIVE_INFINITY]) {
      expect(runRandomLatvianAlphabetLetter({}, { random: () => sample })).toMatchObject({
        error: { issues: [{ code: "invalid_random_source" }] },
        ok: false,
      });
    }
    expect(runRandomLatvianAlphabetLetter({ unexpected: true })).toMatchObject({
      error: { issues: [{ code: "unknown_field", field: "unexpected" }] },
      ok: false,
    });
  });
});
