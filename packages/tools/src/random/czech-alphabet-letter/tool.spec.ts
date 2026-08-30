import { describe, expect, it } from "vitest";
import {
  calculateRandomCzechAlphabetLetter,
  randomCzechAlphabetLetterExample,
  randomCzechAlphabetLetterValueCount,
  runRandomCzechAlphabetLetter,
} from "./tool.js";

describe("Random Czech Alphabet Letter Generator", () => {
  it("executes the canonical example with injected boundary samples", () => {
    expect(JSON.parse(JSON.stringify(randomCzechAlphabetLetterExample))).toEqual(randomCzechAlphabetLetterExample);
    expect(runRandomCzechAlphabetLetter(randomCzechAlphabetLetterExample.input, { random: () => 0 })).toEqual({
      ok: true,
      output: { value: "A" },
    });
    expect(runRandomCzechAlphabetLetter(randomCzechAlphabetLetterExample.input, { random: () => 1 - Number.EPSILON })).toEqual({
      ok: true,
      output: { value: "Ž" },
    });
  });

  it("makes the declared repertoire reachable without weighting gaps", () => {
    const selected = new Set(
      Array.from(
        { length: randomCzechAlphabetLetterValueCount },
        (_, index) =>
          calculateRandomCzechAlphabetLetter(
            () => (index + 0.5) / randomCzechAlphabetLetterValueCount,
          )?.value,
      ),
    );
    expect(selected).not.toContain(undefined);
    expect(selected.size).toBe(randomCzechAlphabetLetterValueCount);
  });

  it("rejects invalid random samples and unexpected input", () => {
    for (const sample of [-0.1, 1, Number.NaN, Number.POSITIVE_INFINITY]) {
      expect(runRandomCzechAlphabetLetter({}, { random: () => sample })).toMatchObject({
        error: { issues: [{ code: "invalid_random_source" }] },
        ok: false,
      });
    }
    expect(runRandomCzechAlphabetLetter({ unexpected: true })).toMatchObject({
      error: { issues: [{ code: "unknown_field", field: "unexpected" }] },
      ok: false,
    });
  });
});
