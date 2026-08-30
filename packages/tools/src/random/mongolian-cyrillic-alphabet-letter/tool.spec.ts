import { describe, expect, it } from "vitest";
import {
  calculateRandomMongolianCyrillicAlphabetLetter,
  randomMongolianCyrillicAlphabetLetterExample,
  randomMongolianCyrillicAlphabetLetterValueCount,
  runRandomMongolianCyrillicAlphabetLetter,
} from "./tool.js";

describe("Random Mongolian Cyrillic Alphabet Letter Generator", () => {
  it("executes the canonical example with injected boundary samples", () => {
    expect(JSON.parse(JSON.stringify(randomMongolianCyrillicAlphabetLetterExample))).toEqual(randomMongolianCyrillicAlphabetLetterExample);
    expect(runRandomMongolianCyrillicAlphabetLetter(randomMongolianCyrillicAlphabetLetterExample.input, { random: () => 0 })).toEqual({
      ok: true,
      output: { value: "А" },
    });
    expect(runRandomMongolianCyrillicAlphabetLetter(randomMongolianCyrillicAlphabetLetterExample.input, { random: () => 1 - Number.EPSILON })).toEqual({
      ok: true,
      output: { value: "Я" },
    });
  });

  it("makes the declared repertoire reachable without weighting gaps", () => {
    const selected = new Set(
      Array.from(
        { length: randomMongolianCyrillicAlphabetLetterValueCount },
        (_, index) =>
          calculateRandomMongolianCyrillicAlphabetLetter(
            () => (index + 0.5) / randomMongolianCyrillicAlphabetLetterValueCount,
          )?.value,
      ),
    );
    expect(selected).not.toContain(undefined);
    expect(selected.size).toBe(randomMongolianCyrillicAlphabetLetterValueCount);
  });

  it("rejects invalid random samples and unexpected input", () => {
    for (const sample of [-0.1, 1, Number.NaN, Number.POSITIVE_INFINITY]) {
      expect(runRandomMongolianCyrillicAlphabetLetter({}, { random: () => sample })).toMatchObject({
        error: { issues: [{ code: "invalid_random_source" }] },
        ok: false,
      });
    }
    expect(runRandomMongolianCyrillicAlphabetLetter({ unexpected: true })).toMatchObject({
      error: { issues: [{ code: "unknown_field", field: "unexpected" }] },
      ok: false,
    });
  });
});
