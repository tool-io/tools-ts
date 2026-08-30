import { describe, expect, it } from "vitest";
import {
  calculateSlabTierBreakEvenValue,
  example,
  runSlabTierBreakEvenValue,
} from "./tool.js";

describe("numismatics/slab-tier-break-even-value", () => {
  it("calculates the published example", () => {
    expect(calculateSlabTierBreakEvenValue(example.input)).toEqual(
      example.output,
    );
    expect(runSlabTierBreakEvenValue(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
  });
  it("rejects a non-finite input", () => {
    const result = runSlabTierBreakEvenValue({
      ...example.input,
      rawCoinCost: Number.NaN,
    });
    expect(result.ok).toBe(false);
  });
});
