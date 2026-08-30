import { describe, expect, it } from "vitest";
import {
  calculateRandomPashtoAlphabetLetter,
  randomPashtoAlphabetLetterExample,
  randomPashtoAlphabetLetterValueCount,
  runRandomPashtoAlphabetLetter,
} from "./tool.js";

describe("Random Pashto Alphabet Letter Generator", () => {
  it("executes the canonical example with injected boundary samples", () => {
    expect(JSON.parse(JSON.stringify(randomPashtoAlphabetLetterExample))).toEqual(randomPashtoAlphabetLetterExample);
    expect(runRandomPashtoAlphabetLetter(randomPashtoAlphabetLetterExample.input, { random: () => 0 })).toEqual({
      ok: true,
      output: { value: "ا" },
    });
    expect(runRandomPashtoAlphabetLetter(randomPashtoAlphabetLetterExample.input, { random: () => 1 - Number.EPSILON })).toEqual({
      ok: true,
      output: { value: "ۍ" },
    });
  });

  it("makes the declared repertoire reachable without weighting gaps", () => {
    const selected = new Set(
      Array.from(
        { length: randomPashtoAlphabetLetterValueCount },
        (_, index) =>
          calculateRandomPashtoAlphabetLetter(
            () => (index + 0.5) / randomPashtoAlphabetLetterValueCount,
          )?.value,
      ),
    );
    expect(selected).not.toContain(undefined);
    expect(selected.size).toBe(randomPashtoAlphabetLetterValueCount);
  });

  it("rejects invalid random samples and unexpected input", () => {
    for (const sample of [-0.1, 1, Number.NaN, Number.POSITIVE_INFINITY]) {
      expect(runRandomPashtoAlphabetLetter({}, { random: () => sample })).toMatchObject({
        error: { issues: [{ code: "invalid_random_source" }] },
        ok: false,
      });
    }
    expect(runRandomPashtoAlphabetLetter({ unexpected: true })).toMatchObject({
      error: { issues: [{ code: "unknown_field", field: "unexpected" }] },
      ok: false,
    });
  });
});
