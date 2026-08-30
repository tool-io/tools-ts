import { describe, expect, it } from "vitest";
import {
  calculateRandomMorseCodePunctuation,
  randomMorseCodePunctuationExample,
  randomMorseCodePunctuationValueCount,
  runRandomMorseCodePunctuation,
} from "./tool.js";

describe("Random Morse Code Punctuation Generator", () => {
  it("executes the canonical example with injected boundary samples", () => {
    expect(JSON.parse(JSON.stringify(randomMorseCodePunctuationExample))).toEqual(randomMorseCodePunctuationExample);
    expect(runRandomMorseCodePunctuation(randomMorseCodePunctuationExample.input, { random: () => 0 })).toEqual({
      ok: true,
      output: { value: ".:·−·−·−" },
    });
    expect(runRandomMorseCodePunctuation(randomMorseCodePunctuationExample.input, { random: () => 1 - Number.EPSILON })).toEqual({
      ok: true,
      output: { value: "@:·−−·−·" },
    });
  });

  it("makes the declared repertoire reachable without weighting gaps", () => {
    const selected = new Set(
      Array.from(
        { length: randomMorseCodePunctuationValueCount },
        (_, index) =>
          calculateRandomMorseCodePunctuation(
            () => (index + 0.5) / randomMorseCodePunctuationValueCount,
          )?.value,
      ),
    );
    expect(selected).not.toContain(undefined);
    expect(selected.size).toBe(randomMorseCodePunctuationValueCount);
  });

  it("rejects invalid random samples and unexpected input", () => {
    for (const sample of [-0.1, 1, Number.NaN, Number.POSITIVE_INFINITY]) {
      expect(runRandomMorseCodePunctuation({}, { random: () => sample })).toMatchObject({
        error: { issues: [{ code: "invalid_random_source" }] },
        ok: false,
      });
    }
    expect(runRandomMorseCodePunctuation({ unexpected: true })).toMatchObject({
      error: { issues: [{ code: "unknown_field", field: "unexpected" }] },
      ok: false,
    });
  });
});
