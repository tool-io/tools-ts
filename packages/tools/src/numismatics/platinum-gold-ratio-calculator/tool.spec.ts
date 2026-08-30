import { describe, expect, it } from "vitest";
import {
  calculatePlatinumGoldRatioCalculator,
  example,
  runPlatinumGoldRatioCalculator,
} from "./tool.js";

describe("numismatics/platinum-gold-ratio-calculator", () => {
  it("calculates the published example", () => {
    expect(calculatePlatinumGoldRatioCalculator(example.input)).toEqual(
      example.output,
    );
    expect(runPlatinumGoldRatioCalculator(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
  });
  it("rejects a non-finite input", () => {
    const result = runPlatinumGoldRatioCalculator({
      ...example.input,
      platinumPricePerTroyOunce: Number.NaN,
    });
    expect(result.ok).toBe(false);
  });
  it("rejects a zero denominator", () => {
    expect(
      runPlatinumGoldRatioCalculator({
        ...example.input,
        goldPricePerTroyOunce: 0,
      }),
    ).toMatchObject({
      ok: false,
      error: { issues: [{ field: "goldPricePerTroyOunce" }] },
    });
  });
});
