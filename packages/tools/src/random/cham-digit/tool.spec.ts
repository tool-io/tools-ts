import { describe, expect, it } from "vitest";
import {
  calculateRandomChamDigit,
  randomChamDigitExample,
  randomChamDigitValueCount,
  runRandomChamDigit,
} from "./tool.js";

describe("Random Cham Digit Generator", () => {
  it("executes the canonical example with injected boundary samples", () => {
    expect(JSON.parse(JSON.stringify(randomChamDigitExample))).toEqual(randomChamDigitExample);
    expect(runRandomChamDigit(randomChamDigitExample.input, { random: () => 0 })).toEqual({
      ok: true,
      output: { value: "꩐" },
    });
    expect(runRandomChamDigit(randomChamDigitExample.input, { random: () => 1 - Number.EPSILON })).toEqual({
      ok: true,
      output: { value: "꩙" },
    });
  });

  it("makes the declared repertoire reachable without weighting gaps", () => {
    const selected = new Set(
      Array.from(
        { length: randomChamDigitValueCount },
        (_, index) =>
          calculateRandomChamDigit(
            () => (index + 0.5) / randomChamDigitValueCount,
          )?.value,
      ),
    );
    expect(selected).not.toContain(undefined);
    expect(selected.size).toBe(randomChamDigitValueCount);
  });

  it("rejects invalid random samples and unexpected input", () => {
    for (const sample of [-0.1, 1, Number.NaN, Number.POSITIVE_INFINITY]) {
      expect(runRandomChamDigit({}, { random: () => sample })).toMatchObject({
        error: { issues: [{ code: "invalid_random_source" }] },
        ok: false,
      });
    }
    expect(runRandomChamDigit({ unexpected: true })).toMatchObject({
      error: { issues: [{ code: "unknown_field", field: "unexpected" }] },
      ok: false,
    });
  });
});
