import { describe, expect, it } from "vitest";
import {
  calculateRandomHebrewFinalFormLetter,
  randomHebrewFinalFormLetterExample,
  randomHebrewFinalFormLetterValueCount,
  runRandomHebrewFinalFormLetter,
} from "./tool.js";

describe("Random Hebrew Final Form Letter Generator", () => {
  it("executes the canonical example with injected boundary samples", () => {
    expect(JSON.parse(JSON.stringify(randomHebrewFinalFormLetterExample))).toEqual(randomHebrewFinalFormLetterExample);
    expect(runRandomHebrewFinalFormLetter(randomHebrewFinalFormLetterExample.input, { random: () => 0 })).toEqual({
      ok: true,
      output: { value: "ך" },
    });
    expect(runRandomHebrewFinalFormLetter(randomHebrewFinalFormLetterExample.input, { random: () => 1 - Number.EPSILON })).toEqual({
      ok: true,
      output: { value: "ץ" },
    });
  });

  it("makes the declared repertoire reachable without weighting gaps", () => {
    const selected = new Set(
      Array.from(
        { length: randomHebrewFinalFormLetterValueCount },
        (_, index) =>
          calculateRandomHebrewFinalFormLetter(
            () => (index + 0.5) / randomHebrewFinalFormLetterValueCount,
          )?.value,
      ),
    );
    expect(selected).not.toContain(undefined);
    expect(selected.size).toBe(randomHebrewFinalFormLetterValueCount);
  });

  it("rejects invalid random samples and unexpected input", () => {
    for (const sample of [-0.1, 1, Number.NaN, Number.POSITIVE_INFINITY]) {
      expect(runRandomHebrewFinalFormLetter({}, { random: () => sample })).toMatchObject({
        error: { issues: [{ code: "invalid_random_source" }] },
        ok: false,
      });
    }
    expect(runRandomHebrewFinalFormLetter({ unexpected: true })).toMatchObject({
      error: { issues: [{ code: "unknown_field", field: "unexpected" }] },
      ok: false,
    });
  });
});
