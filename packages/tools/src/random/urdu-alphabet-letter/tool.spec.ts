import { describe, expect, it } from "vitest";
import {
  calculateRandomUrduAlphabetLetter,
  randomUrduAlphabetLetterExample,
  randomUrduAlphabetLetterValueCount,
  runRandomUrduAlphabetLetter,
} from "./tool.js";

describe("Random Urdu Alphabet Letter Generator", () => {
  it("executes the canonical example with injected boundary samples", () => {
    expect(JSON.parse(JSON.stringify(randomUrduAlphabetLetterExample))).toEqual(randomUrduAlphabetLetterExample);
    expect(runRandomUrduAlphabetLetter(randomUrduAlphabetLetterExample.input, { random: () => 0 })).toEqual({
      ok: true,
      output: { value: "ا" },
    });
    expect(runRandomUrduAlphabetLetter(randomUrduAlphabetLetterExample.input, { random: () => 1 - Number.EPSILON })).toEqual({
      ok: true,
      output: { value: "ے" },
    });
  });

  it("makes the declared repertoire reachable without weighting gaps", () => {
    const selected = new Set(
      Array.from(
        { length: randomUrduAlphabetLetterValueCount },
        (_, index) =>
          calculateRandomUrduAlphabetLetter(
            () => (index + 0.5) / randomUrduAlphabetLetterValueCount,
          )?.value,
      ),
    );
    expect(selected).not.toContain(undefined);
    expect(selected.size).toBe(randomUrduAlphabetLetterValueCount);
  });

  it("rejects invalid random samples and unexpected input", () => {
    for (const sample of [-0.1, 1, Number.NaN, Number.POSITIVE_INFINITY]) {
      expect(runRandomUrduAlphabetLetter({}, { random: () => sample })).toMatchObject({
        error: { issues: [{ code: "invalid_random_source" }] },
        ok: false,
      });
    }
    expect(runRandomUrduAlphabetLetter({ unexpected: true })).toMatchObject({
      error: { issues: [{ code: "unknown_field", field: "unexpected" }] },
      ok: false,
    });
  });
});
