import { describe, expect, it } from "vitest";
import {
  calculateRandomBengaliDigit,
  randomBengaliDigitExample,
  randomBengaliDigitValueCount,
  runRandomBengaliDigit,
} from "./tool.js";

describe("Random Bengali Digit Generator", () => {
  it("executes the canonical example with injected boundary samples", () => {
    expect(JSON.parse(JSON.stringify(randomBengaliDigitExample))).toEqual(randomBengaliDigitExample);
    expect(runRandomBengaliDigit(randomBengaliDigitExample.input, { random: () => 0 })).toEqual({
      ok: true,
      output: { value: "০" },
    });
    expect(runRandomBengaliDigit(randomBengaliDigitExample.input, { random: () => 1 - Number.EPSILON })).toEqual({
      ok: true,
      output: { value: "৯" },
    });
  });

  it("makes the declared repertoire reachable without weighting gaps", () => {
    const selected = new Set(
      Array.from(
        { length: randomBengaliDigitValueCount },
        (_, index) =>
          calculateRandomBengaliDigit(
            () => (index + 0.5) / randomBengaliDigitValueCount,
          )?.value,
      ),
    );
    expect(selected).not.toContain(undefined);
    expect(selected.size).toBe(randomBengaliDigitValueCount);
  });

  it("rejects invalid random samples and unexpected input", () => {
    for (const sample of [-0.1, 1, Number.NaN, Number.POSITIVE_INFINITY]) {
      expect(runRandomBengaliDigit({}, { random: () => sample })).toMatchObject({
        error: { issues: [{ code: "invalid_random_source" }] },
        ok: false,
      });
    }
    expect(runRandomBengaliDigit({ unexpected: true })).toMatchObject({
      error: { issues: [{ code: "unknown_field", field: "unexpected" }] },
      ok: false,
    });
  });
});
