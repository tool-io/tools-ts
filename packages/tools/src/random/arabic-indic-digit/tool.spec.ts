import { describe, expect, it } from "vitest";
import {
  calculateRandomArabicIndicDigit,
  randomArabicIndicDigitExample,
  randomArabicIndicDigitValueCount,
  runRandomArabicIndicDigit,
} from "./tool.js";

describe("Random Arabic-Indic Digit Generator", () => {
  it("executes the canonical example with injected boundary samples", () => {
    expect(JSON.parse(JSON.stringify(randomArabicIndicDigitExample))).toEqual(randomArabicIndicDigitExample);
    expect(runRandomArabicIndicDigit(randomArabicIndicDigitExample.input, { random: () => 0 })).toEqual({
      ok: true,
      output: { value: "٠" },
    });
    expect(runRandomArabicIndicDigit(randomArabicIndicDigitExample.input, { random: () => 1 - Number.EPSILON })).toEqual({
      ok: true,
      output: { value: "٩" },
    });
  });

  it("makes the declared repertoire reachable without weighting gaps", () => {
    const selected = new Set(
      Array.from(
        { length: randomArabicIndicDigitValueCount },
        (_, index) =>
          calculateRandomArabicIndicDigit(
            () => (index + 0.5) / randomArabicIndicDigitValueCount,
          )?.value,
      ),
    );
    expect(selected).not.toContain(undefined);
    expect(selected.size).toBe(randomArabicIndicDigitValueCount);
  });

  it("rejects invalid random samples and unexpected input", () => {
    for (const sample of [-0.1, 1, Number.NaN, Number.POSITIVE_INFINITY]) {
      expect(runRandomArabicIndicDigit({}, { random: () => sample })).toMatchObject({
        error: { issues: [{ code: "invalid_random_source" }] },
        ok: false,
      });
    }
    expect(runRandomArabicIndicDigit({ unexpected: true })).toMatchObject({
      error: { issues: [{ code: "unknown_field", field: "unexpected" }] },
      ok: false,
    });
  });
});
