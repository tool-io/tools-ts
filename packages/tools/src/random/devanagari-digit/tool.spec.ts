import { describe, expect, it } from "vitest";
import {
  calculateRandomDevanagariDigit,
  randomDevanagariDigitExample,
  randomDevanagariDigitValueCount,
  runRandomDevanagariDigit,
} from "./tool.js";

describe("Random Devanagari Digit Generator", () => {
  it("executes the canonical example with injected boundary samples", () => {
    expect(JSON.parse(JSON.stringify(randomDevanagariDigitExample))).toEqual(randomDevanagariDigitExample);
    expect(runRandomDevanagariDigit(randomDevanagariDigitExample.input, { random: () => 0 })).toEqual({
      ok: true,
      output: { value: "०" },
    });
    expect(runRandomDevanagariDigit(randomDevanagariDigitExample.input, { random: () => 1 - Number.EPSILON })).toEqual({
      ok: true,
      output: { value: "९" },
    });
  });

  it("makes the declared repertoire reachable without weighting gaps", () => {
    const selected = new Set(
      Array.from(
        { length: randomDevanagariDigitValueCount },
        (_, index) =>
          calculateRandomDevanagariDigit(
            () => (index + 0.5) / randomDevanagariDigitValueCount,
          )?.value,
      ),
    );
    expect(selected).not.toContain(undefined);
    expect(selected.size).toBe(randomDevanagariDigitValueCount);
  });

  it("rejects invalid random samples and unexpected input", () => {
    for (const sample of [-0.1, 1, Number.NaN, Number.POSITIVE_INFINITY]) {
      expect(runRandomDevanagariDigit({}, { random: () => sample })).toMatchObject({
        error: { issues: [{ code: "invalid_random_source" }] },
        ok: false,
      });
    }
    expect(runRandomDevanagariDigit({ unexpected: true })).toMatchObject({
      error: { issues: [{ code: "unknown_field", field: "unexpected" }] },
      ok: false,
    });
  });
});
