import { describe, expect, it } from "vitest";
import {
  calculateRandomFrenchAccentedLetter,
  randomFrenchAccentedLetterExample,
  randomFrenchAccentedLetterValueCount,
  runRandomFrenchAccentedLetter,
} from "./tool.js";

describe("Random French Accented Letter Generator", () => {
  it("executes the canonical example with injected boundary samples", () => {
    expect(JSON.parse(JSON.stringify(randomFrenchAccentedLetterExample))).toEqual(randomFrenchAccentedLetterExample);
    expect(runRandomFrenchAccentedLetter(randomFrenchAccentedLetterExample.input, { random: () => 0 })).toEqual({
      ok: true,
      output: { value: "À" },
    });
    expect(runRandomFrenchAccentedLetter(randomFrenchAccentedLetterExample.input, { random: () => 1 - Number.EPSILON })).toEqual({
      ok: true,
      output: { value: "Ÿ" },
    });
  });

  it("makes the declared repertoire reachable without weighting gaps", () => {
    const selected = new Set(
      Array.from(
        { length: randomFrenchAccentedLetterValueCount },
        (_, index) =>
          calculateRandomFrenchAccentedLetter(
            () => (index + 0.5) / randomFrenchAccentedLetterValueCount,
          )?.value,
      ),
    );
    expect(selected).not.toContain(undefined);
    expect(selected.size).toBe(randomFrenchAccentedLetterValueCount);
  });

  it("rejects invalid random samples and unexpected input", () => {
    for (const sample of [-0.1, 1, Number.NaN, Number.POSITIVE_INFINITY]) {
      expect(runRandomFrenchAccentedLetter({}, { random: () => sample })).toMatchObject({
        error: { issues: [{ code: "invalid_random_source" }] },
        ok: false,
      });
    }
    expect(runRandomFrenchAccentedLetter({ unexpected: true })).toMatchObject({
      error: { issues: [{ code: "unknown_field", field: "unexpected" }] },
      ok: false,
    });
  });
});
