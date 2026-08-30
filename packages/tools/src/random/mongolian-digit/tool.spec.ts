import { describe, expect, it } from "vitest";
import {
  calculateRandomMongolianDigit,
  randomMongolianDigitExample,
  randomMongolianDigitValueCount,
  runRandomMongolianDigit,
} from "./tool.js";

describe("Random Mongolian Digit Generator", () => {
  it("executes the canonical example with injected boundary samples", () => {
    expect(JSON.parse(JSON.stringify(randomMongolianDigitExample))).toEqual(randomMongolianDigitExample);
    expect(runRandomMongolianDigit(randomMongolianDigitExample.input, { random: () => 0 })).toEqual({
      ok: true,
      output: { value: "᠐" },
    });
    expect(runRandomMongolianDigit(randomMongolianDigitExample.input, { random: () => 1 - Number.EPSILON })).toEqual({
      ok: true,
      output: { value: "᠙" },
    });
  });

  it("makes the declared repertoire reachable without weighting gaps", () => {
    const selected = new Set(
      Array.from(
        { length: randomMongolianDigitValueCount },
        (_, index) =>
          calculateRandomMongolianDigit(
            () => (index + 0.5) / randomMongolianDigitValueCount,
          )?.value,
      ),
    );
    expect(selected).not.toContain(undefined);
    expect(selected.size).toBe(randomMongolianDigitValueCount);
  });

  it("rejects invalid random samples and unexpected input", () => {
    for (const sample of [-0.1, 1, Number.NaN, Number.POSITIVE_INFINITY]) {
      expect(runRandomMongolianDigit({}, { random: () => sample })).toMatchObject({
        error: { issues: [{ code: "invalid_random_source" }] },
        ok: false,
      });
    }
    expect(runRandomMongolianDigit({ unexpected: true })).toMatchObject({
      error: { issues: [{ code: "unknown_field", field: "unexpected" }] },
      ok: false,
    });
  });
});
