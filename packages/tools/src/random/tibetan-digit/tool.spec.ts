import { describe, expect, it } from "vitest";
import {
  calculateRandomTibetanDigit,
  randomTibetanDigitExample,
  randomTibetanDigitValueCount,
  runRandomTibetanDigit,
} from "./tool.js";

describe("Random Tibetan Digit Generator", () => {
  it("executes the canonical example with injected boundary samples", () => {
    expect(JSON.parse(JSON.stringify(randomTibetanDigitExample))).toEqual(randomTibetanDigitExample);
    expect(runRandomTibetanDigit(randomTibetanDigitExample.input, { random: () => 0 })).toEqual({
      ok: true,
      output: { value: "༠" },
    });
    expect(runRandomTibetanDigit(randomTibetanDigitExample.input, { random: () => 1 - Number.EPSILON })).toEqual({
      ok: true,
      output: { value: "༩" },
    });
  });

  it("makes the declared repertoire reachable without weighting gaps", () => {
    const selected = new Set(
      Array.from(
        { length: randomTibetanDigitValueCount },
        (_, index) =>
          calculateRandomTibetanDigit(
            () => (index + 0.5) / randomTibetanDigitValueCount,
          )?.value,
      ),
    );
    expect(selected).not.toContain(undefined);
    expect(selected.size).toBe(randomTibetanDigitValueCount);
  });

  it("rejects invalid random samples and unexpected input", () => {
    for (const sample of [-0.1, 1, Number.NaN, Number.POSITIVE_INFINITY]) {
      expect(runRandomTibetanDigit({}, { random: () => sample })).toMatchObject({
        error: { issues: [{ code: "invalid_random_source" }] },
        ok: false,
      });
    }
    expect(runRandomTibetanDigit({ unexpected: true })).toMatchObject({
      error: { issues: [{ code: "unknown_field", field: "unexpected" }] },
      ok: false,
    });
  });
});
