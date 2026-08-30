import { describe, expect, it } from "vitest";
import {
  calculateRandomLaoDigit,
  randomLaoDigitExample,
  randomLaoDigitValueCount,
  runRandomLaoDigit,
} from "./tool.js";

describe("Random Lao Digit Generator", () => {
  it("executes the canonical example with injected boundary samples", () => {
    expect(JSON.parse(JSON.stringify(randomLaoDigitExample))).toEqual(randomLaoDigitExample);
    expect(runRandomLaoDigit(randomLaoDigitExample.input, { random: () => 0 })).toEqual({
      ok: true,
      output: { value: "໐" },
    });
    expect(runRandomLaoDigit(randomLaoDigitExample.input, { random: () => 1 - Number.EPSILON })).toEqual({
      ok: true,
      output: { value: "໙" },
    });
  });

  it("makes the declared repertoire reachable without weighting gaps", () => {
    const selected = new Set(
      Array.from(
        { length: randomLaoDigitValueCount },
        (_, index) =>
          calculateRandomLaoDigit(
            () => (index + 0.5) / randomLaoDigitValueCount,
          )?.value,
      ),
    );
    expect(selected).not.toContain(undefined);
    expect(selected.size).toBe(randomLaoDigitValueCount);
  });

  it("rejects invalid random samples and unexpected input", () => {
    for (const sample of [-0.1, 1, Number.NaN, Number.POSITIVE_INFINITY]) {
      expect(runRandomLaoDigit({}, { random: () => sample })).toMatchObject({
        error: { issues: [{ code: "invalid_random_source" }] },
        ok: false,
      });
    }
    expect(runRandomLaoDigit({ unexpected: true })).toMatchObject({
      error: { issues: [{ code: "unknown_field", field: "unexpected" }] },
      ok: false,
    });
  });
});
