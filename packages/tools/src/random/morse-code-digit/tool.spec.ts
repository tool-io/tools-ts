import { describe, expect, it } from "vitest";
import {
  calculateRandomMorseCodeDigit,
  randomMorseCodeDigitExample,
  randomMorseCodeDigitValueCount,
  runRandomMorseCodeDigit,
} from "./tool.js";

describe("Random Morse Code Digit Generator", () => {
  it("executes the canonical example with injected boundary samples", () => {
    expect(JSON.parse(JSON.stringify(randomMorseCodeDigitExample))).toEqual(randomMorseCodeDigitExample);
    expect(runRandomMorseCodeDigit(randomMorseCodeDigitExample.input, { random: () => 0 })).toEqual({
      ok: true,
      output: { value: "0:−−−−−" },
    });
    expect(runRandomMorseCodeDigit(randomMorseCodeDigitExample.input, { random: () => 1 - Number.EPSILON })).toEqual({
      ok: true,
      output: { value: "9:−−−−·" },
    });
  });

  it("makes the declared repertoire reachable without weighting gaps", () => {
    const selected = new Set(
      Array.from(
        { length: randomMorseCodeDigitValueCount },
        (_, index) =>
          calculateRandomMorseCodeDigit(
            () => (index + 0.5) / randomMorseCodeDigitValueCount,
          )?.value,
      ),
    );
    expect(selected).not.toContain(undefined);
    expect(selected.size).toBe(randomMorseCodeDigitValueCount);
  });

  it("rejects invalid random samples and unexpected input", () => {
    for (const sample of [-0.1, 1, Number.NaN, Number.POSITIVE_INFINITY]) {
      expect(runRandomMorseCodeDigit({}, { random: () => sample })).toMatchObject({
        error: { issues: [{ code: "invalid_random_source" }] },
        ok: false,
      });
    }
    expect(runRandomMorseCodeDigit({ unexpected: true })).toMatchObject({
      error: { issues: [{ code: "unknown_field", field: "unexpected" }] },
      ok: false,
    });
  });
});
