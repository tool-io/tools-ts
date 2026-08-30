import { describe, expect, it } from "vitest";
import {
  calculateRandomJavaneseDigit,
  randomJavaneseDigitExample,
  randomJavaneseDigitValueCount,
  runRandomJavaneseDigit,
} from "./tool.js";

describe("Random Javanese Digit Generator", () => {
  it("executes the canonical example with injected boundary samples", () => {
    expect(JSON.parse(JSON.stringify(randomJavaneseDigitExample))).toEqual(randomJavaneseDigitExample);
    expect(runRandomJavaneseDigit(randomJavaneseDigitExample.input, { random: () => 0 })).toEqual({
      ok: true,
      output: { value: "꧐" },
    });
    expect(runRandomJavaneseDigit(randomJavaneseDigitExample.input, { random: () => 1 - Number.EPSILON })).toEqual({
      ok: true,
      output: { value: "꧙" },
    });
  });

  it("makes the declared repertoire reachable without weighting gaps", () => {
    const selected = new Set(
      Array.from(
        { length: randomJavaneseDigitValueCount },
        (_, index) =>
          calculateRandomJavaneseDigit(
            () => (index + 0.5) / randomJavaneseDigitValueCount,
          )?.value,
      ),
    );
    expect(selected).not.toContain(undefined);
    expect(selected.size).toBe(randomJavaneseDigitValueCount);
  });

  it("rejects invalid random samples and unexpected input", () => {
    for (const sample of [-0.1, 1, Number.NaN, Number.POSITIVE_INFINITY]) {
      expect(runRandomJavaneseDigit({}, { random: () => sample })).toMatchObject({
        error: { issues: [{ code: "invalid_random_source" }] },
        ok: false,
      });
    }
    expect(runRandomJavaneseDigit({ unexpected: true })).toMatchObject({
      error: { issues: [{ code: "unknown_field", field: "unexpected" }] },
      ok: false,
    });
  });
});
