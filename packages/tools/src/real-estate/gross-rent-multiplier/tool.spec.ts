import { describe, expect, it } from "vitest";
import { grossRentMultiplierExample, runGrossRentMultiplier } from "./tool.js";

describe("real-estate/gross-rent-multiplier", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runGrossRentMultiplier(grossRentMultiplierExample.input)).toEqual({
      ok: true,
      output: grossRentMultiplierExample.output,
    });
  });

  it("halves the multiplier when rent doubles for a fixed price", () => {
    const base = runGrossRentMultiplier({
      purchasePriceUsd: 500000,
      grossAnnualRentUsd: 80000,
    });
    const higher = runGrossRentMultiplier({
      purchasePriceUsd: 500000,
      grossAnnualRentUsd: 160000,
    });
    expect(base.ok && higher.ok).toBe(true);
    if (base.ok && higher.ok)
      expect(higher.output.grossRentMultiplier as number).toBe(
        (base.output.grossRentMultiplier as number) / 2,
      );
  });

  it("rejects non-positive price and rent", () => {
    expect(
      runGrossRentMultiplier({ purchasePriceUsd: 0, grossAnnualRentUsd: 80000 })
        .ok,
    ).toBe(false);
    expect(
      runGrossRentMultiplier({
        purchasePriceUsd: 500000,
        grossAnnualRentUsd: -5,
      }).ok,
    ).toBe(false);
  });
});
