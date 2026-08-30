import { describe, expect, it } from "vitest";
import {
  calculateRandomSundaneseDigit,
  randomSundaneseDigitExample,
  randomSundaneseDigitValueCount,
  runRandomSundaneseDigit,
} from "./tool.js";

describe("Random Sundanese Digit Generator", () => {
  it("executes the canonical example with injected boundary samples", () => {
    expect(JSON.parse(JSON.stringify(randomSundaneseDigitExample))).toEqual(randomSundaneseDigitExample);
    expect(runRandomSundaneseDigit(randomSundaneseDigitExample.input, { random: () => 0 })).toEqual({
      ok: true,
      output: { value: "᮰" },
    });
    expect(runRandomSundaneseDigit(randomSundaneseDigitExample.input, { random: () => 1 - Number.EPSILON })).toEqual({
      ok: true,
      output: { value: "᮹" },
    });
  });

  it("makes the declared repertoire reachable without weighting gaps", () => {
    const selected = new Set(
      Array.from(
        { length: randomSundaneseDigitValueCount },
        (_, index) =>
          calculateRandomSundaneseDigit(
            () => (index + 0.5) / randomSundaneseDigitValueCount,
          )?.value,
      ),
    );
    expect(selected).not.toContain(undefined);
    expect(selected.size).toBe(randomSundaneseDigitValueCount);
  });

  it("rejects invalid random samples and unexpected input", () => {
    for (const sample of [-0.1, 1, Number.NaN, Number.POSITIVE_INFINITY]) {
      expect(runRandomSundaneseDigit({}, { random: () => sample })).toMatchObject({
        error: { issues: [{ code: "invalid_random_source" }] },
        ok: false,
      });
    }
    expect(runRandomSundaneseDigit({ unexpected: true })).toMatchObject({
      error: { issues: [{ code: "unknown_field", field: "unexpected" }] },
      ok: false,
    });
  });
});
