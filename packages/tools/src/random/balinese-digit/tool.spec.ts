import { describe, expect, it } from "vitest";
import {
  calculateRandomBalineseDigit,
  randomBalineseDigitExample,
  randomBalineseDigitValueCount,
  runRandomBalineseDigit,
} from "./tool.js";

describe("Random Balinese Digit Generator", () => {
  it("executes the canonical example with injected boundary samples", () => {
    expect(JSON.parse(JSON.stringify(randomBalineseDigitExample))).toEqual(randomBalineseDigitExample);
    expect(runRandomBalineseDigit(randomBalineseDigitExample.input, { random: () => 0 })).toEqual({
      ok: true,
      output: { value: "᭐" },
    });
    expect(runRandomBalineseDigit(randomBalineseDigitExample.input, { random: () => 1 - Number.EPSILON })).toEqual({
      ok: true,
      output: { value: "᭙" },
    });
  });

  it("makes the declared repertoire reachable without weighting gaps", () => {
    const selected = new Set(
      Array.from(
        { length: randomBalineseDigitValueCount },
        (_, index) =>
          calculateRandomBalineseDigit(
            () => (index + 0.5) / randomBalineseDigitValueCount,
          )?.value,
      ),
    );
    expect(selected).not.toContain(undefined);
    expect(selected.size).toBe(randomBalineseDigitValueCount);
  });

  it("rejects invalid random samples and unexpected input", () => {
    for (const sample of [-0.1, 1, Number.NaN, Number.POSITIVE_INFINITY]) {
      expect(runRandomBalineseDigit({}, { random: () => sample })).toMatchObject({
        error: { issues: [{ code: "invalid_random_source" }] },
        ok: false,
      });
    }
    expect(runRandomBalineseDigit({ unexpected: true })).toMatchObject({
      error: { issues: [{ code: "unknown_field", field: "unexpected" }] },
      ok: false,
    });
  });
});
