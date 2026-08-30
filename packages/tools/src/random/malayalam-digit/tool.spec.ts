import { describe, expect, it } from "vitest";
import {
  calculateRandomMalayalamDigit,
  randomMalayalamDigitExample,
  randomMalayalamDigitValueCount,
  runRandomMalayalamDigit,
} from "./tool.js";

describe("Random Malayalam Digit Generator", () => {
  it("executes the canonical example with injected boundary samples", () => {
    expect(JSON.parse(JSON.stringify(randomMalayalamDigitExample))).toEqual(randomMalayalamDigitExample);
    expect(runRandomMalayalamDigit(randomMalayalamDigitExample.input, { random: () => 0 })).toEqual({
      ok: true,
      output: { value: "൦" },
    });
    expect(runRandomMalayalamDigit(randomMalayalamDigitExample.input, { random: () => 1 - Number.EPSILON })).toEqual({
      ok: true,
      output: { value: "൯" },
    });
  });

  it("makes the declared repertoire reachable without weighting gaps", () => {
    const selected = new Set(
      Array.from(
        { length: randomMalayalamDigitValueCount },
        (_, index) =>
          calculateRandomMalayalamDigit(
            () => (index + 0.5) / randomMalayalamDigitValueCount,
          )?.value,
      ),
    );
    expect(selected).not.toContain(undefined);
    expect(selected.size).toBe(randomMalayalamDigitValueCount);
  });

  it("rejects invalid random samples and unexpected input", () => {
    for (const sample of [-0.1, 1, Number.NaN, Number.POSITIVE_INFINITY]) {
      expect(runRandomMalayalamDigit({}, { random: () => sample })).toMatchObject({
        error: { issues: [{ code: "invalid_random_source" }] },
        ok: false,
      });
    }
    expect(runRandomMalayalamDigit({ unexpected: true })).toMatchObject({
      error: { issues: [{ code: "unknown_field", field: "unexpected" }] },
      ok: false,
    });
  });
});
