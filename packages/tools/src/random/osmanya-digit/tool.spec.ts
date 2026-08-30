import { describe, expect, it } from "vitest";
import {
  calculateRandomOsmanyaDigit,
  randomOsmanyaDigitExample,
  randomOsmanyaDigitValueCount,
  runRandomOsmanyaDigit,
} from "./tool.js";

describe("Random Osmanya Digit Generator", () => {
  it("executes the canonical example with injected boundary samples", () => {
    expect(JSON.parse(JSON.stringify(randomOsmanyaDigitExample))).toEqual(randomOsmanyaDigitExample);
    expect(runRandomOsmanyaDigit(randomOsmanyaDigitExample.input, { random: () => 0 })).toEqual({
      ok: true,
      output: { value: "𐒠" },
    });
    expect(runRandomOsmanyaDigit(randomOsmanyaDigitExample.input, { random: () => 1 - Number.EPSILON })).toEqual({
      ok: true,
      output: { value: "𐒩" },
    });
  });

  it("makes the declared repertoire reachable without weighting gaps", () => {
    const selected = new Set(
      Array.from(
        { length: randomOsmanyaDigitValueCount },
        (_, index) =>
          calculateRandomOsmanyaDigit(
            () => (index + 0.5) / randomOsmanyaDigitValueCount,
          )?.value,
      ),
    );
    expect(selected).not.toContain(undefined);
    expect(selected.size).toBe(randomOsmanyaDigitValueCount);
  });

  it("rejects invalid random samples and unexpected input", () => {
    for (const sample of [-0.1, 1, Number.NaN, Number.POSITIVE_INFINITY]) {
      expect(runRandomOsmanyaDigit({}, { random: () => sample })).toMatchObject({
        error: { issues: [{ code: "invalid_random_source" }] },
        ok: false,
      });
    }
    expect(runRandomOsmanyaDigit({ unexpected: true })).toMatchObject({
      error: { issues: [{ code: "unknown_field", field: "unexpected" }] },
      ok: false,
    });
  });
});
