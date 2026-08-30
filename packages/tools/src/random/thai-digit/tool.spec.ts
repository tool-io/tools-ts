import { describe, expect, it } from "vitest";
import {
  calculateRandomThaiDigit,
  randomThaiDigitExample,
  randomThaiDigitValueCount,
  runRandomThaiDigit,
} from "./tool.js";

describe("Random Thai Digit Generator", () => {
  it("executes the canonical example with injected boundary samples", () => {
    expect(JSON.parse(JSON.stringify(randomThaiDigitExample))).toEqual(randomThaiDigitExample);
    expect(runRandomThaiDigit(randomThaiDigitExample.input, { random: () => 0 })).toEqual({
      ok: true,
      output: { value: "๐" },
    });
    expect(runRandomThaiDigit(randomThaiDigitExample.input, { random: () => 1 - Number.EPSILON })).toEqual({
      ok: true,
      output: { value: "๙" },
    });
  });

  it("makes the declared repertoire reachable without weighting gaps", () => {
    const selected = new Set(
      Array.from(
        { length: randomThaiDigitValueCount },
        (_, index) =>
          calculateRandomThaiDigit(
            () => (index + 0.5) / randomThaiDigitValueCount,
          )?.value,
      ),
    );
    expect(selected).not.toContain(undefined);
    expect(selected.size).toBe(randomThaiDigitValueCount);
  });

  it("rejects invalid random samples and unexpected input", () => {
    for (const sample of [-0.1, 1, Number.NaN, Number.POSITIVE_INFINITY]) {
      expect(runRandomThaiDigit({}, { random: () => sample })).toMatchObject({
        error: { issues: [{ code: "invalid_random_source" }] },
        ok: false,
      });
    }
    expect(runRandomThaiDigit({ unexpected: true })).toMatchObject({
      error: { issues: [{ code: "unknown_field", field: "unexpected" }] },
      ok: false,
    });
  });
});
