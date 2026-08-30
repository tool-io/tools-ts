import { describe, expect, it } from "vitest";
import {
  calculateRandomOlChikiDigit,
  randomOlChikiDigitExample,
  randomOlChikiDigitValueCount,
  runRandomOlChikiDigit,
} from "./tool.js";

describe("Random Ol Chiki Digit Generator", () => {
  it("executes the canonical example with injected boundary samples", () => {
    expect(JSON.parse(JSON.stringify(randomOlChikiDigitExample))).toEqual(randomOlChikiDigitExample);
    expect(runRandomOlChikiDigit(randomOlChikiDigitExample.input, { random: () => 0 })).toEqual({
      ok: true,
      output: { value: "᱐" },
    });
    expect(runRandomOlChikiDigit(randomOlChikiDigitExample.input, { random: () => 1 - Number.EPSILON })).toEqual({
      ok: true,
      output: { value: "᱙" },
    });
  });

  it("makes the declared repertoire reachable without weighting gaps", () => {
    const selected = new Set(
      Array.from(
        { length: randomOlChikiDigitValueCount },
        (_, index) =>
          calculateRandomOlChikiDigit(
            () => (index + 0.5) / randomOlChikiDigitValueCount,
          )?.value,
      ),
    );
    expect(selected).not.toContain(undefined);
    expect(selected.size).toBe(randomOlChikiDigitValueCount);
  });

  it("rejects invalid random samples and unexpected input", () => {
    for (const sample of [-0.1, 1, Number.NaN, Number.POSITIVE_INFINITY]) {
      expect(runRandomOlChikiDigit({}, { random: () => sample })).toMatchObject({
        error: { issues: [{ code: "invalid_random_source" }] },
        ok: false,
      });
    }
    expect(runRandomOlChikiDigit({ unexpected: true })).toMatchObject({
      error: { issues: [{ code: "unknown_field", field: "unexpected" }] },
      ok: false,
    });
  });
});
