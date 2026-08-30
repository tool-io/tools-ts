import { describe, expect, it } from "vitest";
import {
  calculateRandomFaroeseAlphabetLetter,
  randomFaroeseAlphabetLetterExample,
  randomFaroeseAlphabetLetterValueCount,
  runRandomFaroeseAlphabetLetter,
} from "./tool.js";

describe("Random Faroese Alphabet Letter Generator", () => {
  it("executes the canonical example with injected boundary samples", () => {
    expect(JSON.parse(JSON.stringify(randomFaroeseAlphabetLetterExample))).toEqual(randomFaroeseAlphabetLetterExample);
    expect(runRandomFaroeseAlphabetLetter(randomFaroeseAlphabetLetterExample.input, { random: () => 0 })).toEqual({
      ok: true,
      output: { value: "A" },
    });
    expect(runRandomFaroeseAlphabetLetter(randomFaroeseAlphabetLetterExample.input, { random: () => 1 - Number.EPSILON })).toEqual({
      ok: true,
      output: { value: "Ø" },
    });
  });

  it("makes the declared repertoire reachable without weighting gaps", () => {
    const selected = new Set(
      Array.from(
        { length: randomFaroeseAlphabetLetterValueCount },
        (_, index) =>
          calculateRandomFaroeseAlphabetLetter(
            () => (index + 0.5) / randomFaroeseAlphabetLetterValueCount,
          )?.value,
      ),
    );
    expect(selected).not.toContain(undefined);
    expect(selected.size).toBe(randomFaroeseAlphabetLetterValueCount);
  });

  it("rejects invalid random samples and unexpected input", () => {
    for (const sample of [-0.1, 1, Number.NaN, Number.POSITIVE_INFINITY]) {
      expect(runRandomFaroeseAlphabetLetter({}, { random: () => sample })).toMatchObject({
        error: { issues: [{ code: "invalid_random_source" }] },
        ok: false,
      });
    }
    expect(runRandomFaroeseAlphabetLetter({ unexpected: true })).toMatchObject({
      error: { issues: [{ code: "unknown_field", field: "unexpected" }] },
      ok: false,
    });
  });
});
