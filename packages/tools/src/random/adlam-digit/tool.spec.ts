import { describe, expect, it } from "vitest";
import {
  calculateRandomAdlamDigit,
  randomAdlamDigitExample,
  randomAdlamDigitValueCount,
  runRandomAdlamDigit,
} from "./tool.js";

describe("Random Adlam Digit Generator", () => {
  it("executes the canonical example with injected boundary samples", () => {
    expect(JSON.parse(JSON.stringify(randomAdlamDigitExample))).toEqual(randomAdlamDigitExample);
    expect(runRandomAdlamDigit(randomAdlamDigitExample.input, { random: () => 0 })).toEqual({
      ok: true,
      output: { value: "𞥐" },
    });
    expect(runRandomAdlamDigit(randomAdlamDigitExample.input, { random: () => 1 - Number.EPSILON })).toEqual({
      ok: true,
      output: { value: "𞥙" },
    });
  });

  it("makes the declared repertoire reachable without weighting gaps", () => {
    const selected = new Set(
      Array.from(
        { length: randomAdlamDigitValueCount },
        (_, index) =>
          calculateRandomAdlamDigit(
            () => (index + 0.5) / randomAdlamDigitValueCount,
          )?.value,
      ),
    );
    expect(selected).not.toContain(undefined);
    expect(selected.size).toBe(randomAdlamDigitValueCount);
  });

  it("rejects invalid random samples and unexpected input", () => {
    for (const sample of [-0.1, 1, Number.NaN, Number.POSITIVE_INFINITY]) {
      expect(runRandomAdlamDigit({}, { random: () => sample })).toMatchObject({
        error: { issues: [{ code: "invalid_random_source" }] },
        ok: false,
      });
    }
    expect(runRandomAdlamDigit({ unexpected: true })).toMatchObject({
      error: { issues: [{ code: "unknown_field", field: "unexpected" }] },
      ok: false,
    });
  });
});
