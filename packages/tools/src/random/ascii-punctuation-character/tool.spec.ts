import { describe, expect, it } from "vitest";
import {
  calculateRandomAsciiPunctuationCharacter,
  randomAsciiPunctuationCharacterExample,
  randomAsciiPunctuationCharacterValueCount,
  runRandomAsciiPunctuationCharacter,
} from "./tool.js";

describe("Random ASCII Punctuation Character Generator", () => {
  it("executes the canonical example with injected boundary samples", () => {
    expect(JSON.parse(JSON.stringify(randomAsciiPunctuationCharacterExample))).toEqual(randomAsciiPunctuationCharacterExample);
    expect(runRandomAsciiPunctuationCharacter(randomAsciiPunctuationCharacterExample.input, { random: () => 0 })).toEqual({
      ok: true,
      output: { value: "!" },
    });
    expect(runRandomAsciiPunctuationCharacter(randomAsciiPunctuationCharacterExample.input, { random: () => 1 - Number.EPSILON })).toEqual({
      ok: true,
      output: { value: "~" },
    });
  });

  it("makes the declared repertoire reachable without weighting gaps", () => {
    const selected = new Set(
      Array.from(
        { length: randomAsciiPunctuationCharacterValueCount },
        (_, index) =>
          calculateRandomAsciiPunctuationCharacter(
            () => (index + 0.5) / randomAsciiPunctuationCharacterValueCount,
          )?.value,
      ),
    );
    expect(selected).not.toContain(undefined);
    expect(selected.size).toBe(randomAsciiPunctuationCharacterValueCount);
  });

  it("rejects invalid random samples and unexpected input", () => {
    for (const sample of [-0.1, 1, Number.NaN, Number.POSITIVE_INFINITY]) {
      expect(runRandomAsciiPunctuationCharacter({}, { random: () => sample })).toMatchObject({
        error: { issues: [{ code: "invalid_random_source" }] },
        ok: false,
      });
    }
    expect(runRandomAsciiPunctuationCharacter({ unexpected: true })).toMatchObject({
      error: { issues: [{ code: "unknown_field", field: "unexpected" }] },
      ok: false,
    });
  });
});
