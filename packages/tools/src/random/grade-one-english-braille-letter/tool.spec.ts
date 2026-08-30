import { describe, expect, it } from "vitest";
import {
  calculateRandomGradeOneEnglishBrailleLetter,
  randomGradeOneEnglishBrailleLetterExample,
  randomGradeOneEnglishBrailleLetterValueCount,
  runRandomGradeOneEnglishBrailleLetter,
} from "./tool.js";

describe("Random Grade 1 English Braille Letter Generator", () => {
  it("executes the canonical example with injected boundary samples", () => {
    expect(JSON.parse(JSON.stringify(randomGradeOneEnglishBrailleLetterExample))).toEqual(randomGradeOneEnglishBrailleLetterExample);
    expect(runRandomGradeOneEnglishBrailleLetter(randomGradeOneEnglishBrailleLetterExample.input, { random: () => 0 })).toEqual({
      ok: true,
      output: { value: "⠁" },
    });
    expect(runRandomGradeOneEnglishBrailleLetter(randomGradeOneEnglishBrailleLetterExample.input, { random: () => 1 - Number.EPSILON })).toEqual({
      ok: true,
      output: { value: "⠵" },
    });
  });

  it("makes the declared repertoire reachable without weighting gaps", () => {
    const selected = new Set(
      Array.from(
        { length: randomGradeOneEnglishBrailleLetterValueCount },
        (_, index) =>
          calculateRandomGradeOneEnglishBrailleLetter(
            () => (index + 0.5) / randomGradeOneEnglishBrailleLetterValueCount,
          )?.value,
      ),
    );
    expect(selected).not.toContain(undefined);
    expect(selected.size).toBe(randomGradeOneEnglishBrailleLetterValueCount);
  });

  it("rejects invalid random samples and unexpected input", () => {
    for (const sample of [-0.1, 1, Number.NaN, Number.POSITIVE_INFINITY]) {
      expect(runRandomGradeOneEnglishBrailleLetter({}, { random: () => sample })).toMatchObject({
        error: { issues: [{ code: "invalid_random_source" }] },
        ok: false,
      });
    }
    expect(runRandomGradeOneEnglishBrailleLetter({ unexpected: true })).toMatchObject({
      error: { issues: [{ code: "unknown_field", field: "unexpected" }] },
      ok: false,
    });
  });
});
