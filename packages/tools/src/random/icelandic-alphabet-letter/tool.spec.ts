import { describe, expect, it } from "vitest";
import {
  calculateRandomIcelandicAlphabetLetter,
  randomIcelandicAlphabetLetterExample,
  randomIcelandicAlphabetLetterValueCount,
  runRandomIcelandicAlphabetLetter,
} from "./tool.js";

describe("Random Icelandic Alphabet Letter Generator", () => {
  it("executes the canonical example with injected boundary samples", () => {
    expect(JSON.parse(JSON.stringify(randomIcelandicAlphabetLetterExample))).toEqual(randomIcelandicAlphabetLetterExample);
    expect(runRandomIcelandicAlphabetLetter(randomIcelandicAlphabetLetterExample.input, { random: () => 0 })).toEqual({
      ok: true,
      output: { value: "A" },
    });
    expect(runRandomIcelandicAlphabetLetter(randomIcelandicAlphabetLetterExample.input, { random: () => 1 - Number.EPSILON })).toEqual({
      ok: true,
      output: { value: "Ö" },
    });
  });

  it("makes the declared repertoire reachable without weighting gaps", () => {
    const selected = new Set(
      Array.from(
        { length: randomIcelandicAlphabetLetterValueCount },
        (_, index) =>
          calculateRandomIcelandicAlphabetLetter(
            () => (index + 0.5) / randomIcelandicAlphabetLetterValueCount,
          )?.value,
      ),
    );
    expect(selected).not.toContain(undefined);
    expect(selected.size).toBe(randomIcelandicAlphabetLetterValueCount);
  });

  it("rejects invalid random samples and unexpected input", () => {
    for (const sample of [-0.1, 1, Number.NaN, Number.POSITIVE_INFINITY]) {
      expect(runRandomIcelandicAlphabetLetter({}, { random: () => sample })).toMatchObject({
        error: { issues: [{ code: "invalid_random_source" }] },
        ok: false,
      });
    }
    expect(runRandomIcelandicAlphabetLetter({ unexpected: true })).toMatchObject({
      error: { issues: [{ code: "unknown_field", field: "unexpected" }] },
      ok: false,
    });
  });
});
