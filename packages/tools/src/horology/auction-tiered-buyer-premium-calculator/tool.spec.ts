import { describe, expect, it } from "vitest";
import {
  auctionPremiumExample,
  calculateAuctionTieredBuyersPremium,
  runAuctionPremium,
} from "./tool.js";

describe("auction tiered buyer's-premium calculator", () => {
  it("reproduces the canonical progressive-tier example", () => {
    expect(runAuctionPremium(auctionPremiumExample.input)).toEqual({
      ok: true,
      output: auctionPremiumExample.output,
    });
  });

  it("applies only the first tier to a low hammer price", () => {
    expect(
      calculateAuctionTieredBuyersPremium({
        hammerPrice: 1000,
        additionalCharges: 0,
        tiers: [
          [0, 1000, 10],
          [1000, 0, 20],
        ],
      }),
    ).toMatchObject({ appliedTierCount: 1, buyersPremium: 100 });
  });

  it("applies no premium at a zero hammer price", () => {
    expect(
      calculateAuctionTieredBuyersPremium({
        hammerPrice: 0,
        additionalCharges: 25,
        tiers: [[0, 0, 25]],
      }),
    ).toMatchObject({ appliedTierCount: 0, totalBeforeTax: 25 });
  });

  it("rejects noncontiguous tiers", () => {
    expect(
      runAuctionPremium({
        hammerPrice: 1000,
        additionalCharges: 0,
        tiers: [
          [0, 500, 10],
          [600, 0, 20],
        ],
      }),
    ).toMatchObject({
      error: { issues: [{ code: "noncontiguous_tiers", field: "tiers" }] },
      ok: false,
    });
  });

  it("rejects a nonfinal unbounded tier", () => {
    expect(
      runAuctionPremium({
        hammerPrice: 1000,
        additionalCharges: 0,
        tiers: [
          [0, 0, 10],
          [0, 0, 20],
        ],
      }),
    ).toMatchObject({
      error: { issues: [{ code: "nonfinal_unbounded_tier", field: "tiers" }] },
      ok: false,
    });
  });
});
