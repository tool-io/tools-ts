import { describe, expect, it } from "vitest";
import {
  calculateAuctionBuyerPremiumTotal,
  example,
  runAuctionBuyerPremiumTotal,
} from "./tool.js";

describe("numismatics/auction-buyer-premium-total", () => {
  it("calculates the published example", () => {
    expect(calculateAuctionBuyerPremiumTotal(example.input)).toEqual(
      example.output,
    );
    expect(runAuctionBuyerPremiumTotal(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
  });
  it("rejects a non-finite input", () => {
    const result = runAuctionBuyerPremiumTotal({
      ...example.input,
      hammerPrice: Number.NaN,
    });
    expect(result.ok).toBe(false);
  });
  it("checks an independent value or domain boundary", () => {
    expect(
      calculateAuctionBuyerPremiumTotal({
        hammerPrice: 100,
        buyerPremiumPercent: 20,
      }).totalBeforeTax,
    ).toBe(120);
  });
});
