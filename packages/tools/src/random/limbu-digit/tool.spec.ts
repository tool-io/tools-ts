import { describe, expect, it } from "vitest";
import {
  calculateRandomLimbuDigit,
  randomLimbuDigitExample,
  randomLimbuDigitValueCount,
  runRandomLimbuDigit,
} from "./tool.js";

describe("Random Limbu Digit Generator", () => {
  it("executes the canonical example with injected boundary samples", () => {
    expect(JSON.parse(JSON.stringify(randomLimbuDigitExample))).toEqual(randomLimbuDigitExample);
    expect(runRandomLimbuDigit(randomLimbuDigitExample.input, { random: () => 0 })).toEqual({
      ok: true,
      output: { value: "᥆" },
    });
    expect(runRandomLimbuDigit(randomLimbuDigitExample.input, { random: () => 1 - Number.EPSILON })).toEqual({
      ok: true,
      output: { value: "᥏" },
    });
  });

  it("makes the declared repertoire reachable without weighting gaps", () => {
    const selected = new Set(
      Array.from(
        { length: randomLimbuDigitValueCount },
        (_, index) =>
          calculateRandomLimbuDigit(
            () => (index + 0.5) / randomLimbuDigitValueCount,
          )?.value,
      ),
    );
    expect(selected).not.toContain(undefined);
    expect(selected.size).toBe(randomLimbuDigitValueCount);
  });

  it("rejects invalid random samples and unexpected input", () => {
    for (const sample of [-0.1, 1, Number.NaN, Number.POSITIVE_INFINITY]) {
      expect(runRandomLimbuDigit({}, { random: () => sample })).toMatchObject({
        error: { issues: [{ code: "invalid_random_source" }] },
        ok: false,
      });
    }
    expect(runRandomLimbuDigit({ unexpected: true })).toMatchObject({
      error: { issues: [{ code: "unknown_field", field: "unexpected" }] },
      ok: false,
    });
  });
});
