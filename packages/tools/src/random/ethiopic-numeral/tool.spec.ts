import { describe, expect, it } from "vitest";
import {
  calculateRandomEthiopicNumeral,
  randomEthiopicNumeralExample,
  randomEthiopicNumeralValueCount,
  runRandomEthiopicNumeral,
} from "./tool.js";

describe("Random Ethiopic Numeral Generator", () => {
  it("executes the canonical example with injected boundary samples", () => {
    expect(JSON.parse(JSON.stringify(randomEthiopicNumeralExample))).toEqual(randomEthiopicNumeralExample);
    expect(runRandomEthiopicNumeral(randomEthiopicNumeralExample.input, { random: () => 0 })).toEqual({
      ok: true,
      output: { value: "፩" },
    });
    expect(runRandomEthiopicNumeral(randomEthiopicNumeralExample.input, { random: () => 1 - Number.EPSILON })).toEqual({
      ok: true,
      output: { value: "፼" },
    });
  });

  it("makes the declared repertoire reachable without weighting gaps", () => {
    const selected = new Set(
      Array.from(
        { length: randomEthiopicNumeralValueCount },
        (_, index) =>
          calculateRandomEthiopicNumeral(
            () => (index + 0.5) / randomEthiopicNumeralValueCount,
          )?.value,
      ),
    );
    expect(selected).not.toContain(undefined);
    expect(selected.size).toBe(randomEthiopicNumeralValueCount);
  });

  it("rejects invalid random samples and unexpected input", () => {
    for (const sample of [-0.1, 1, Number.NaN, Number.POSITIVE_INFINITY]) {
      expect(runRandomEthiopicNumeral({}, { random: () => sample })).toMatchObject({
        error: { issues: [{ code: "invalid_random_source" }] },
        ok: false,
      });
    }
    expect(runRandomEthiopicNumeral({ unexpected: true })).toMatchObject({
      error: { issues: [{ code: "unknown_field", field: "unexpected" }] },
      ok: false,
    });
  });
});
