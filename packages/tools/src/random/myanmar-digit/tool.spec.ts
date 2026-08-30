import { describe, expect, it } from "vitest";
import {
  calculateRandomMyanmarDigit,
  randomMyanmarDigitExample,
  randomMyanmarDigitValueCount,
  runRandomMyanmarDigit,
} from "./tool.js";

describe("Random Myanmar Digit Generator", () => {
  it("executes the canonical example with injected boundary samples", () => {
    expect(JSON.parse(JSON.stringify(randomMyanmarDigitExample))).toEqual(randomMyanmarDigitExample);
    expect(runRandomMyanmarDigit(randomMyanmarDigitExample.input, { random: () => 0 })).toEqual({
      ok: true,
      output: { value: "၀" },
    });
    expect(runRandomMyanmarDigit(randomMyanmarDigitExample.input, { random: () => 1 - Number.EPSILON })).toEqual({
      ok: true,
      output: { value: "၉" },
    });
  });

  it("makes the declared repertoire reachable without weighting gaps", () => {
    const selected = new Set(
      Array.from(
        { length: randomMyanmarDigitValueCount },
        (_, index) =>
          calculateRandomMyanmarDigit(
            () => (index + 0.5) / randomMyanmarDigitValueCount,
          )?.value,
      ),
    );
    expect(selected).not.toContain(undefined);
    expect(selected.size).toBe(randomMyanmarDigitValueCount);
  });

  it("rejects invalid random samples and unexpected input", () => {
    for (const sample of [-0.1, 1, Number.NaN, Number.POSITIVE_INFINITY]) {
      expect(runRandomMyanmarDigit({}, { random: () => sample })).toMatchObject({
        error: { issues: [{ code: "invalid_random_source" }] },
        ok: false,
      });
    }
    expect(runRandomMyanmarDigit({ unexpected: true })).toMatchObject({
      error: { issues: [{ code: "unknown_field", field: "unexpected" }] },
      ok: false,
    });
  });
});
