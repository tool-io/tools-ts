import { describe, expect, it } from "vitest";
import {
  calculateRandomWelshAlphabetLetter,
  randomWelshAlphabetLetterExample,
  randomWelshAlphabetLetterValueCount,
  runRandomWelshAlphabetLetter,
} from "./tool.js";

describe("Random Welsh Alphabet Letter Generator", () => {
  it("executes the canonical example with injected boundary samples", () => {
    expect(JSON.parse(JSON.stringify(randomWelshAlphabetLetterExample))).toEqual(randomWelshAlphabetLetterExample);
    expect(runRandomWelshAlphabetLetter(randomWelshAlphabetLetterExample.input, { random: () => 0 })).toEqual({
      ok: true,
      output: { value: "A" },
    });
    expect(runRandomWelshAlphabetLetter(randomWelshAlphabetLetterExample.input, { random: () => 1 - Number.EPSILON })).toEqual({
      ok: true,
      output: { value: "Y" },
    });
  });

  it("makes the declared repertoire reachable without weighting gaps", () => {
    const selected = new Set(
      Array.from(
        { length: randomWelshAlphabetLetterValueCount },
        (_, index) =>
          calculateRandomWelshAlphabetLetter(
            () => (index + 0.5) / randomWelshAlphabetLetterValueCount,
          )?.value,
      ),
    );
    expect(selected).not.toContain(undefined);
    expect(selected.size).toBe(randomWelshAlphabetLetterValueCount);
  });

  it("rejects invalid random samples and unexpected input", () => {
    for (const sample of [-0.1, 1, Number.NaN, Number.POSITIVE_INFINITY]) {
      expect(runRandomWelshAlphabetLetter({}, { random: () => sample })).toMatchObject({
        error: { issues: [{ code: "invalid_random_source" }] },
        ok: false,
      });
    }
    expect(runRandomWelshAlphabetLetter({ unexpected: true })).toMatchObject({
      error: { issues: [{ code: "unknown_field", field: "unexpected" }] },
      ok: false,
    });
  });
});
