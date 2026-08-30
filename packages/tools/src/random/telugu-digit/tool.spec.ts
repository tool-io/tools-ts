import { describe, expect, it } from "vitest";
import {
  calculateRandomTeluguDigit,
  randomTeluguDigitExample,
  randomTeluguDigitValueCount,
  runRandomTeluguDigit,
} from "./tool.js";

describe("Random Telugu Digit Generator", () => {
  it("executes the canonical example with injected boundary samples", () => {
    expect(JSON.parse(JSON.stringify(randomTeluguDigitExample))).toEqual(randomTeluguDigitExample);
    expect(runRandomTeluguDigit(randomTeluguDigitExample.input, { random: () => 0 })).toEqual({
      ok: true,
      output: { value: "౦" },
    });
    expect(runRandomTeluguDigit(randomTeluguDigitExample.input, { random: () => 1 - Number.EPSILON })).toEqual({
      ok: true,
      output: { value: "౯" },
    });
  });

  it("makes the declared repertoire reachable without weighting gaps", () => {
    const selected = new Set(
      Array.from(
        { length: randomTeluguDigitValueCount },
        (_, index) =>
          calculateRandomTeluguDigit(
            () => (index + 0.5) / randomTeluguDigitValueCount,
          )?.value,
      ),
    );
    expect(selected).not.toContain(undefined);
    expect(selected.size).toBe(randomTeluguDigitValueCount);
  });

  it("rejects invalid random samples and unexpected input", () => {
    for (const sample of [-0.1, 1, Number.NaN, Number.POSITIVE_INFINITY]) {
      expect(runRandomTeluguDigit({}, { random: () => sample })).toMatchObject({
        error: { issues: [{ code: "invalid_random_source" }] },
        ok: false,
      });
    }
    expect(runRandomTeluguDigit({ unexpected: true })).toMatchObject({
      error: { issues: [{ code: "unknown_field", field: "unexpected" }] },
      ok: false,
    });
  });
});
