import { describe, expect, it } from "vitest";
import {
  calculateRandomSinhalaDigit,
  randomSinhalaDigitExample,
  randomSinhalaDigitValueCount,
  runRandomSinhalaDigit,
} from "./tool.js";

describe("Random Sinhala Digit Generator", () => {
  it("executes the canonical example with injected boundary samples", () => {
    expect(JSON.parse(JSON.stringify(randomSinhalaDigitExample))).toEqual(randomSinhalaDigitExample);
    expect(runRandomSinhalaDigit(randomSinhalaDigitExample.input, { random: () => 0 })).toEqual({
      ok: true,
      output: { value: "෦" },
    });
    expect(runRandomSinhalaDigit(randomSinhalaDigitExample.input, { random: () => 1 - Number.EPSILON })).toEqual({
      ok: true,
      output: { value: "෯" },
    });
  });

  it("makes the declared repertoire reachable without weighting gaps", () => {
    const selected = new Set(
      Array.from(
        { length: randomSinhalaDigitValueCount },
        (_, index) =>
          calculateRandomSinhalaDigit(
            () => (index + 0.5) / randomSinhalaDigitValueCount,
          )?.value,
      ),
    );
    expect(selected).not.toContain(undefined);
    expect(selected.size).toBe(randomSinhalaDigitValueCount);
  });

  it("rejects invalid random samples and unexpected input", () => {
    for (const sample of [-0.1, 1, Number.NaN, Number.POSITIVE_INFINITY]) {
      expect(runRandomSinhalaDigit({}, { random: () => sample })).toMatchObject({
        error: { issues: [{ code: "invalid_random_source" }] },
        ok: false,
      });
    }
    expect(runRandomSinhalaDigit({ unexpected: true })).toMatchObject({
      error: { issues: [{ code: "unknown_field", field: "unexpected" }] },
      ok: false,
    });
  });
});
