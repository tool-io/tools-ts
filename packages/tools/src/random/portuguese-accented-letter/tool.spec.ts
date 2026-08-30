import { describe, expect, it } from "vitest";
import {
  calculateRandomPortugueseAccentedLetter,
  randomPortugueseAccentedLetterExample,
  randomPortugueseAccentedLetterValueCount,
  runRandomPortugueseAccentedLetter,
} from "./tool.js";

describe("Random Portuguese Accented Letter Generator", () => {
  it("executes the canonical example with injected boundary samples", () => {
    expect(JSON.parse(JSON.stringify(randomPortugueseAccentedLetterExample))).toEqual(randomPortugueseAccentedLetterExample);
    expect(runRandomPortugueseAccentedLetter(randomPortugueseAccentedLetterExample.input, { random: () => 0 })).toEqual({
      ok: true,
      output: { value: "Á" },
    });
    expect(runRandomPortugueseAccentedLetter(randomPortugueseAccentedLetterExample.input, { random: () => 1 - Number.EPSILON })).toEqual({
      ok: true,
      output: { value: "Ú" },
    });
  });

  it("makes the declared repertoire reachable without weighting gaps", () => {
    const selected = new Set(
      Array.from(
        { length: randomPortugueseAccentedLetterValueCount },
        (_, index) =>
          calculateRandomPortugueseAccentedLetter(
            () => (index + 0.5) / randomPortugueseAccentedLetterValueCount,
          )?.value,
      ),
    );
    expect(selected).not.toContain(undefined);
    expect(selected.size).toBe(randomPortugueseAccentedLetterValueCount);
  });

  it("rejects invalid random samples and unexpected input", () => {
    for (const sample of [-0.1, 1, Number.NaN, Number.POSITIVE_INFINITY]) {
      expect(runRandomPortugueseAccentedLetter({}, { random: () => sample })).toMatchObject({
        error: { issues: [{ code: "invalid_random_source" }] },
        ok: false,
      });
    }
    expect(runRandomPortugueseAccentedLetter({ unexpected: true })).toMatchObject({
      error: { issues: [{ code: "unknown_field", field: "unexpected" }] },
      ok: false,
    });
  });
});
