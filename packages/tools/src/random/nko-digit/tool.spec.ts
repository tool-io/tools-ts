import { describe, expect, it } from "vitest";
import {
  calculateRandomNkoDigit,
  randomNkoDigitExample,
  randomNkoDigitValueCount,
  runRandomNkoDigit,
} from "./tool.js";

describe("Random NKo Digit Generator", () => {
  it("executes the canonical example with injected boundary samples", () => {
    expect(JSON.parse(JSON.stringify(randomNkoDigitExample))).toEqual(randomNkoDigitExample);
    expect(runRandomNkoDigit(randomNkoDigitExample.input, { random: () => 0 })).toEqual({
      ok: true,
      output: { value: "߀" },
    });
    expect(runRandomNkoDigit(randomNkoDigitExample.input, { random: () => 1 - Number.EPSILON })).toEqual({
      ok: true,
      output: { value: "߉" },
    });
  });

  it("makes the declared repertoire reachable without weighting gaps", () => {
    const selected = new Set(
      Array.from(
        { length: randomNkoDigitValueCount },
        (_, index) =>
          calculateRandomNkoDigit(
            () => (index + 0.5) / randomNkoDigitValueCount,
          )?.value,
      ),
    );
    expect(selected).not.toContain(undefined);
    expect(selected.size).toBe(randomNkoDigitValueCount);
  });

  it("rejects invalid random samples and unexpected input", () => {
    for (const sample of [-0.1, 1, Number.NaN, Number.POSITIVE_INFINITY]) {
      expect(runRandomNkoDigit({}, { random: () => sample })).toMatchObject({
        error: { issues: [{ code: "invalid_random_source" }] },
        ok: false,
      });
    }
    expect(runRandomNkoDigit({ unexpected: true })).toMatchObject({
      error: { issues: [{ code: "unknown_field", field: "unexpected" }] },
      ok: false,
    });
  });
});
