import { describe, expect, it } from "vitest";
import {
  calculateRandomLatinVowel,
  randomLatinVowelExample,
  randomLatinVowelValueCount,
  runRandomLatinVowel,
} from "./tool.js";

describe("Random Latin Vowel Generator", () => {
  it("executes the canonical example with injected boundary samples", () => {
    expect(JSON.parse(JSON.stringify(randomLatinVowelExample))).toEqual(randomLatinVowelExample);
    expect(runRandomLatinVowel(randomLatinVowelExample.input, { random: () => 0 })).toEqual({
      ok: true,
      output: { value: "A" },
    });
    expect(runRandomLatinVowel(randomLatinVowelExample.input, { random: () => 1 - Number.EPSILON })).toEqual({
      ok: true,
      output: { value: "u" },
    });
  });

  it("makes the declared repertoire reachable without weighting gaps", () => {
    const selected = new Set(
      Array.from(
        { length: randomLatinVowelValueCount },
        (_, index) =>
          calculateRandomLatinVowel(
            () => (index + 0.5) / randomLatinVowelValueCount,
          )?.value,
      ),
    );
    expect(selected).not.toContain(undefined);
    expect(selected.size).toBe(randomLatinVowelValueCount);
  });

  it("rejects invalid random samples and unexpected input", () => {
    for (const sample of [-0.1, 1, Number.NaN, Number.POSITIVE_INFINITY]) {
      expect(runRandomLatinVowel({}, { random: () => sample })).toMatchObject({
        error: { issues: [{ code: "invalid_random_source" }] },
        ok: false,
      });
    }
    expect(runRandomLatinVowel({ unexpected: true })).toMatchObject({
      error: { issues: [{ code: "unknown_field", field: "unexpected" }] },
      ok: false,
    });
  });
});
