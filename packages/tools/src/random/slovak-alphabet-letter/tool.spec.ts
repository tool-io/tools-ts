import { describe, expect, it } from "vitest";
import {
  calculateRandomSlovakAlphabetLetter,
  randomSlovakAlphabetLetterExample,
  randomSlovakAlphabetLetterValueCount,
  runRandomSlovakAlphabetLetter,
} from "./tool.js";

describe("Random Slovak Alphabet Letter Generator", () => {
  it("executes the canonical example with injected boundary samples", () => {
    expect(JSON.parse(JSON.stringify(randomSlovakAlphabetLetterExample))).toEqual(randomSlovakAlphabetLetterExample);
    expect(runRandomSlovakAlphabetLetter(randomSlovakAlphabetLetterExample.input, { random: () => 0 })).toEqual({
      ok: true,
      output: { value: "A" },
    });
    expect(runRandomSlovakAlphabetLetter(randomSlovakAlphabetLetterExample.input, { random: () => 1 - Number.EPSILON })).toEqual({
      ok: true,
      output: { value: "Ž" },
    });
  });

  it("makes the declared repertoire reachable without weighting gaps", () => {
    const selected = new Set(
      Array.from(
        { length: randomSlovakAlphabetLetterValueCount },
        (_, index) =>
          calculateRandomSlovakAlphabetLetter(
            () => (index + 0.5) / randomSlovakAlphabetLetterValueCount,
          )?.value,
      ),
    );
    expect(selected).not.toContain(undefined);
    expect(selected.size).toBe(randomSlovakAlphabetLetterValueCount);
  });

  it("rejects invalid random samples and unexpected input", () => {
    for (const sample of [-0.1, 1, Number.NaN, Number.POSITIVE_INFINITY]) {
      expect(runRandomSlovakAlphabetLetter({}, { random: () => sample })).toMatchObject({
        error: { issues: [{ code: "invalid_random_source" }] },
        ok: false,
      });
    }
    expect(runRandomSlovakAlphabetLetter({ unexpected: true })).toMatchObject({
      error: { issues: [{ code: "unknown_field", field: "unexpected" }] },
      ok: false,
    });
  });
});
