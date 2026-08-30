import { describe, expect, it } from "vitest";
import {
  calculateRandomGermanAlphabetLetter,
  randomGermanAlphabetLetterExample,
  randomGermanAlphabetLetterValueCount,
  runRandomGermanAlphabetLetter,
} from "./tool.js";

describe("Random German Alphabet Letter Generator", () => {
  it("executes the canonical example with injected boundary samples", () => {
    expect(JSON.parse(JSON.stringify(randomGermanAlphabetLetterExample))).toEqual(randomGermanAlphabetLetterExample);
    expect(runRandomGermanAlphabetLetter(randomGermanAlphabetLetterExample.input, { random: () => 0 })).toEqual({
      ok: true,
      output: { value: "A" },
    });
    expect(runRandomGermanAlphabetLetter(randomGermanAlphabetLetterExample.input, { random: () => 1 - Number.EPSILON })).toEqual({
      ok: true,
      output: { value: "ẞ" },
    });
  });

  it("makes the declared repertoire reachable without weighting gaps", () => {
    const selected = new Set(
      Array.from(
        { length: randomGermanAlphabetLetterValueCount },
        (_, index) =>
          calculateRandomGermanAlphabetLetter(
            () => (index + 0.5) / randomGermanAlphabetLetterValueCount,
          )?.value,
      ),
    );
    expect(selected).not.toContain(undefined);
    expect(selected.size).toBe(randomGermanAlphabetLetterValueCount);
  });

  it("rejects invalid random samples and unexpected input", () => {
    for (const sample of [-0.1, 1, Number.NaN, Number.POSITIVE_INFINITY]) {
      expect(runRandomGermanAlphabetLetter({}, { random: () => sample })).toMatchObject({
        error: { issues: [{ code: "invalid_random_source" }] },
        ok: false,
      });
    }
    expect(runRandomGermanAlphabetLetter({ unexpected: true })).toMatchObject({
      error: { issues: [{ code: "unknown_field", field: "unexpected" }] },
      ok: false,
    });
  });
});
