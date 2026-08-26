import { describe, expect, it } from "vitest";
import {
  calculateParityDistributionPercent,
  runParityDistributionPercent,
  parityDistributionPercentExample,
} from "./tool.js";

describe("demography/parity-distribution-percent", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runParityDistributionPercent(parityDistributionPercentExample.input),
    ).toEqual({
      ok: true,
      output: parityDistributionPercentExample.output,
    });
  });

  it("normalizes a single-parity population to one hundred percent", () => {
    expect(calculateParityDistributionPercent({ womenByParity: [7] })).toEqual({
      percentages: [100],
    });
  });

  it("rejects an empty or non-positive-total distribution", () => {
    expect(runParityDistributionPercent({ womenByParity: [] }).ok).toBe(false);
    expect(runParityDistributionPercent({ womenByParity: [0, 0] }).ok).toBe(
      false,
    );
  });
});
