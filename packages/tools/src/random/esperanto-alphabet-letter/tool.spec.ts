import { describe, expect, it } from "vitest";
import {
  calculateRandomEsperantoAlphabetLetter,
  randomEsperantoAlphabetLetterExample,
  randomEsperantoAlphabetLetterValueCount,
  runRandomEsperantoAlphabetLetter,
} from "./tool.js";

describe("Random Esperanto Alphabet Letter Generator", () => {
  it("executes the canonical example with injected boundary samples", () => {
    expect(JSON.parse(JSON.stringify(randomEsperantoAlphabetLetterExample))).toEqual(randomEsperantoAlphabetLetterExample);
    expect(runRandomEsperantoAlphabetLetter(randomEsperantoAlphabetLetterExample.input, { random: () => 0 })).toEqual({
      ok: true,
      output: { value: "A" },
    });
    expect(runRandomEsperantoAlphabetLetter(randomEsperantoAlphabetLetterExample.input, { random: () => 1 - Number.EPSILON })).toEqual({
      ok: true,
      output: { value: "Z" },
    });
  });

  it("makes the declared repertoire reachable without weighting gaps", () => {
    const selected = new Set(
      Array.from(
        { length: randomEsperantoAlphabetLetterValueCount },
        (_, index) =>
          calculateRandomEsperantoAlphabetLetter(
            () => (index + 0.5) / randomEsperantoAlphabetLetterValueCount,
          )?.value,
      ),
    );
    expect(selected).not.toContain(undefined);
    expect(selected.size).toBe(randomEsperantoAlphabetLetterValueCount);
  });

  it("rejects invalid random samples and unexpected input", () => {
    for (const sample of [-0.1, 1, Number.NaN, Number.POSITIVE_INFINITY]) {
      expect(runRandomEsperantoAlphabetLetter({}, { random: () => sample })).toMatchObject({
        error: { issues: [{ code: "invalid_random_source" }] },
        ok: false,
      });
    }
    expect(runRandomEsperantoAlphabetLetter({ unexpected: true })).toMatchObject({
      error: { issues: [{ code: "unknown_field", field: "unexpected" }] },
      ok: false,
    });
  });
});
