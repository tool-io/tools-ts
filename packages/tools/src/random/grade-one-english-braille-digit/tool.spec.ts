import { describe, expect, it } from "vitest";
import {
  calculateRandomGradeOneEnglishBrailleDigit,
  randomGradeOneEnglishBrailleDigitExample,
  randomGradeOneEnglishBrailleDigitValueCount,
  runRandomGradeOneEnglishBrailleDigit,
} from "./tool.js";

describe("Random Grade 1 English Braille Digit Generator", () => {
  it("executes the canonical example with injected boundary samples", () => {
    expect(JSON.parse(JSON.stringify(randomGradeOneEnglishBrailleDigitExample))).toEqual(randomGradeOneEnglishBrailleDigitExample);
    expect(runRandomGradeOneEnglishBrailleDigit(randomGradeOneEnglishBrailleDigitExample.input, { random: () => 0 })).toEqual({
      ok: true,
      output: { value: "⠼⠁" },
    });
    expect(runRandomGradeOneEnglishBrailleDigit(randomGradeOneEnglishBrailleDigitExample.input, { random: () => 1 - Number.EPSILON })).toEqual({
      ok: true,
      output: { value: "⠼⠚" },
    });
  });

  it("makes the declared repertoire reachable without weighting gaps", () => {
    const selected = new Set(
      Array.from(
        { length: randomGradeOneEnglishBrailleDigitValueCount },
        (_, index) =>
          calculateRandomGradeOneEnglishBrailleDigit(
            () => (index + 0.5) / randomGradeOneEnglishBrailleDigitValueCount,
          )?.value,
      ),
    );
    expect(selected).not.toContain(undefined);
    expect(selected.size).toBe(randomGradeOneEnglishBrailleDigitValueCount);
  });

  it("rejects invalid random samples and unexpected input", () => {
    for (const sample of [-0.1, 1, Number.NaN, Number.POSITIVE_INFINITY]) {
      expect(runRandomGradeOneEnglishBrailleDigit({}, { random: () => sample })).toMatchObject({
        error: { issues: [{ code: "invalid_random_source" }] },
        ok: false,
      });
    }
    expect(runRandomGradeOneEnglishBrailleDigit({ unexpected: true })).toMatchObject({
      error: { issues: [{ code: "unknown_field", field: "unexpected" }] },
      ok: false,
    });
  });
});
