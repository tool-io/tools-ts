import { describe, expect, it } from "vitest";
import {
  calculateRandomOdiaDigit,
  randomOdiaDigitExample,
  randomOdiaDigitValueCount,
  runRandomOdiaDigit,
} from "./tool.js";

describe("Random Odia Digit Generator", () => {
  it("executes the canonical example with injected boundary samples", () => {
    expect(JSON.parse(JSON.stringify(randomOdiaDigitExample))).toEqual(randomOdiaDigitExample);
    expect(runRandomOdiaDigit(randomOdiaDigitExample.input, { random: () => 0 })).toEqual({
      ok: true,
      output: { value: "୦" },
    });
    expect(runRandomOdiaDigit(randomOdiaDigitExample.input, { random: () => 1 - Number.EPSILON })).toEqual({
      ok: true,
      output: { value: "୯" },
    });
  });

  it("makes the declared repertoire reachable without weighting gaps", () => {
    const selected = new Set(
      Array.from(
        { length: randomOdiaDigitValueCount },
        (_, index) =>
          calculateRandomOdiaDigit(
            () => (index + 0.5) / randomOdiaDigitValueCount,
          )?.value,
      ),
    );
    expect(selected).not.toContain(undefined);
    expect(selected.size).toBe(randomOdiaDigitValueCount);
  });

  it("rejects invalid random samples and unexpected input", () => {
    for (const sample of [-0.1, 1, Number.NaN, Number.POSITIVE_INFINITY]) {
      expect(runRandomOdiaDigit({}, { random: () => sample })).toMatchObject({
        error: { issues: [{ code: "invalid_random_source" }] },
        ok: false,
      });
    }
    expect(runRandomOdiaDigit({ unexpected: true })).toMatchObject({
      error: { issues: [{ code: "unknown_field", field: "unexpected" }] },
      ok: false,
    });
  });
});
