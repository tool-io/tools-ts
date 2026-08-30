import { describe, expect, it } from "vitest";
import {
  calculateRandomMacedonianAlphabetLetter,
  randomMacedonianAlphabetLetterExample,
  randomMacedonianAlphabetLetterValueCount,
  runRandomMacedonianAlphabetLetter,
} from "./tool.js";

describe("Random Macedonian Alphabet Letter Generator", () => {
  it("executes the canonical example with injected boundary samples", () => {
    expect(JSON.parse(JSON.stringify(randomMacedonianAlphabetLetterExample))).toEqual(randomMacedonianAlphabetLetterExample);
    expect(runRandomMacedonianAlphabetLetter(randomMacedonianAlphabetLetterExample.input, { random: () => 0 })).toEqual({
      ok: true,
      output: { value: "А" },
    });
    expect(runRandomMacedonianAlphabetLetter(randomMacedonianAlphabetLetterExample.input, { random: () => 1 - Number.EPSILON })).toEqual({
      ok: true,
      output: { value: "Ш" },
    });
  });

  it("makes the declared repertoire reachable without weighting gaps", () => {
    const selected = new Set(
      Array.from(
        { length: randomMacedonianAlphabetLetterValueCount },
        (_, index) =>
          calculateRandomMacedonianAlphabetLetter(
            () => (index + 0.5) / randomMacedonianAlphabetLetterValueCount,
          )?.value,
      ),
    );
    expect(selected).not.toContain(undefined);
    expect(selected.size).toBe(randomMacedonianAlphabetLetterValueCount);
  });

  it("rejects invalid random samples and unexpected input", () => {
    for (const sample of [-0.1, 1, Number.NaN, Number.POSITIVE_INFINITY]) {
      expect(runRandomMacedonianAlphabetLetter({}, { random: () => sample })).toMatchObject({
        error: { issues: [{ code: "invalid_random_source" }] },
        ok: false,
      });
    }
    expect(runRandomMacedonianAlphabetLetter({ unexpected: true })).toMatchObject({
      error: { issues: [{ code: "unknown_field", field: "unexpected" }] },
      ok: false,
    });
  });
});
