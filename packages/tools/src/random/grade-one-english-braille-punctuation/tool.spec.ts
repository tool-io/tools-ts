import { describe, expect, it } from "vitest";
import {
  calculateRandomGradeOneEnglishBraillePunctuation,
  randomGradeOneEnglishBraillePunctuationExample,
  randomGradeOneEnglishBraillePunctuationValueCount,
  runRandomGradeOneEnglishBraillePunctuation,
} from "./tool.js";

describe("Random Grade 1 English Braille Punctuation Generator", () => {
  it("executes the canonical example with injected boundary samples", () => {
    expect(JSON.parse(JSON.stringify(randomGradeOneEnglishBraillePunctuationExample))).toEqual(randomGradeOneEnglishBraillePunctuationExample);
    expect(runRandomGradeOneEnglishBraillePunctuation(randomGradeOneEnglishBraillePunctuationExample.input, { random: () => 0 })).toEqual({
      ok: true,
      output: { value: "⠂" },
    });
    expect(runRandomGradeOneEnglishBraillePunctuation(randomGradeOneEnglishBraillePunctuationExample.input, { random: () => 1 - Number.EPSILON })).toEqual({
      ok: true,
      output: { value: "⠌" },
    });
  });

  it("makes the declared repertoire reachable without weighting gaps", () => {
    const selected = new Set(
      Array.from(
        { length: randomGradeOneEnglishBraillePunctuationValueCount },
        (_, index) =>
          calculateRandomGradeOneEnglishBraillePunctuation(
            () => (index + 0.5) / randomGradeOneEnglishBraillePunctuationValueCount,
          )?.value,
      ),
    );
    expect(selected).not.toContain(undefined);
    expect(selected.size).toBe(randomGradeOneEnglishBraillePunctuationValueCount);
  });

  it("rejects invalid random samples and unexpected input", () => {
    for (const sample of [-0.1, 1, Number.NaN, Number.POSITIVE_INFINITY]) {
      expect(runRandomGradeOneEnglishBraillePunctuation({}, { random: () => sample })).toMatchObject({
        error: { issues: [{ code: "invalid_random_source" }] },
        ok: false,
      });
    }
    expect(runRandomGradeOneEnglishBraillePunctuation({ unexpected: true })).toMatchObject({
      error: { issues: [{ code: "unknown_field", field: "unexpected" }] },
      ok: false,
    });
  });
});
