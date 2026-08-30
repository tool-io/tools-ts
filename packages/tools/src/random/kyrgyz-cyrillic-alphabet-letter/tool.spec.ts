import { describe, expect, it } from "vitest";
import {
  calculateRandomKyrgyzCyrillicAlphabetLetter,
  randomKyrgyzCyrillicAlphabetLetterExample,
  randomKyrgyzCyrillicAlphabetLetterValueCount,
  runRandomKyrgyzCyrillicAlphabetLetter,
} from "./tool.js";

describe("Random Kyrgyz Cyrillic Alphabet Letter Generator", () => {
  it("executes the canonical example with injected boundary samples", () => {
    expect(JSON.parse(JSON.stringify(randomKyrgyzCyrillicAlphabetLetterExample))).toEqual(randomKyrgyzCyrillicAlphabetLetterExample);
    expect(runRandomKyrgyzCyrillicAlphabetLetter(randomKyrgyzCyrillicAlphabetLetterExample.input, { random: () => 0 })).toEqual({
      ok: true,
      output: { value: "А" },
    });
    expect(runRandomKyrgyzCyrillicAlphabetLetter(randomKyrgyzCyrillicAlphabetLetterExample.input, { random: () => 1 - Number.EPSILON })).toEqual({
      ok: true,
      output: { value: "Я" },
    });
  });

  it("makes the declared repertoire reachable without weighting gaps", () => {
    const selected = new Set(
      Array.from(
        { length: randomKyrgyzCyrillicAlphabetLetterValueCount },
        (_, index) =>
          calculateRandomKyrgyzCyrillicAlphabetLetter(
            () => (index + 0.5) / randomKyrgyzCyrillicAlphabetLetterValueCount,
          )?.value,
      ),
    );
    expect(selected).not.toContain(undefined);
    expect(selected.size).toBe(randomKyrgyzCyrillicAlphabetLetterValueCount);
  });

  it("rejects invalid random samples and unexpected input", () => {
    for (const sample of [-0.1, 1, Number.NaN, Number.POSITIVE_INFINITY]) {
      expect(runRandomKyrgyzCyrillicAlphabetLetter({}, { random: () => sample })).toMatchObject({
        error: { issues: [{ code: "invalid_random_source" }] },
        ok: false,
      });
    }
    expect(runRandomKyrgyzCyrillicAlphabetLetter({ unexpected: true })).toMatchObject({
      error: { issues: [{ code: "unknown_field", field: "unexpected" }] },
      ok: false,
    });
  });
});
