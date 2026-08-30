import { describe, expect, it } from "vitest";
import {
  calculateWarNickelSilverContentValue,
  example,
  runWarNickelSilverContentValue,
} from "./tool.js";

describe("numismatics/war-nickel-silver-content-value", () => {
  it("calculates the published example", () => {
    expect(calculateWarNickelSilverContentValue(example.input)).toEqual(
      example.output,
    );
    expect(runWarNickelSilverContentValue(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
  });
  it("rejects a non-finite input", () => {
    const result = runWarNickelSilverContentValue({
      ...example.input,
      coinCount: Number.NaN,
    });
    expect(result.ok).toBe(false);
  });
  it("checks an independent value or domain boundary", () => {
    expect(
      calculateWarNickelSilverContentValue({
        coinCount: 1,
        silverPricePerTroyOunce: 31.1034768,
      }).silverContentValue,
    ).toBeCloseTo(1.75);
  });
});
