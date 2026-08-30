import { describe, expect, it } from "vitest";
import {
  calculateRandomSuzhouNumeral,
  randomSuzhouNumeralExample,
  randomSuzhouNumeralValueCount,
  runRandomSuzhouNumeral,
} from "./tool.js";

describe("Random Suzhou Numeral Generator", () => {
  it("executes the canonical example with injected boundary samples", () => {
    expect(JSON.parse(JSON.stringify(randomSuzhouNumeralExample))).toEqual(randomSuzhouNumeralExample);
    expect(runRandomSuzhouNumeral(randomSuzhouNumeralExample.input, { random: () => 0 })).toEqual({
      ok: true,
      output: { value: "〡" },
    });
    expect(runRandomSuzhouNumeral(randomSuzhouNumeralExample.input, { random: () => 1 - Number.EPSILON })).toEqual({
      ok: true,
      output: { value: "〺" },
    });
  });

  it("makes the declared repertoire reachable without weighting gaps", () => {
    const selected = new Set(
      Array.from(
        { length: randomSuzhouNumeralValueCount },
        (_, index) =>
          calculateRandomSuzhouNumeral(
            () => (index + 0.5) / randomSuzhouNumeralValueCount,
          )?.value,
      ),
    );
    expect(selected).not.toContain(undefined);
    expect(selected.size).toBe(randomSuzhouNumeralValueCount);
  });

  it("rejects invalid random samples and unexpected input", () => {
    for (const sample of [-0.1, 1, Number.NaN, Number.POSITIVE_INFINITY]) {
      expect(runRandomSuzhouNumeral({}, { random: () => sample })).toMatchObject({
        error: { issues: [{ code: "invalid_random_source" }] },
        ok: false,
      });
    }
    expect(runRandomSuzhouNumeral({ unexpected: true })).toMatchObject({
      error: { issues: [{ code: "unknown_field", field: "unexpected" }] },
      ok: false,
    });
  });
});
