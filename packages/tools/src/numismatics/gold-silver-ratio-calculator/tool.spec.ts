import { describe, expect, it } from "vitest";
import {
  calculateGoldSilverRatioCalculator,
  example,
  runGoldSilverRatioCalculator,
} from "./tool.js";

describe("numismatics/gold-silver-ratio-calculator", () => {
  it("calculates the published example", () => {
    expect(calculateGoldSilverRatioCalculator(example.input)).toEqual(
      example.output,
    );
    expect(runGoldSilverRatioCalculator(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
  });
  it("rejects a non-finite input", () => {
    const result = runGoldSilverRatioCalculator({
      ...example.input,
      goldPricePerTroyOunce: Number.NaN,
    });
    expect(result.ok).toBe(false);
  });
  it("rejects a zero denominator", () => {
    expect(
      runGoldSilverRatioCalculator({
        ...example.input,
        silverPricePerTroyOunce: 0,
      }),
    ).toMatchObject({
      ok: false,
      error: { issues: [{ field: "silverPricePerTroyOunce" }] },
    });
  });
});
