import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type AuctionPremiumTier = readonly [
  fromAmount: number,
  toAmountOrZeroForUnbounded: number,
  ratePercent: number,
];

export type AuctionPremiumInput = {
  readonly additionalCharges: number;
  readonly hammerPrice: number;
  readonly tiers: readonly (readonly number[])[];
};

export type AuctionPremiumOutput = {
  readonly appliedTierCount: number;
  readonly buyersPremium: number;
  readonly subtotalBeforeTax: number;
  readonly totalBeforeTax: number;
};

export const calculateAuctionTieredBuyersPremium = (
  input: AuctionPremiumInput,
): AuctionPremiumOutput => {
  if (!Number.isFinite(input.hammerPrice) || input.hammerPrice < 0)
    simpleError(
      "hammerPrice",
      "Hammer price must be finite and nonnegative.",
      "hammer_price_invalid",
    );
  if (!Number.isFinite(input.additionalCharges) || input.additionalCharges < 0)
    simpleError(
      "additionalCharges",
      "Additional charges must be finite and nonnegative.",
      "additional_charges_invalid",
    );
  if (input.tiers.length < 1)
    simpleError(
      "tiers",
      "At least one buyer-premium tier is required.",
      "insufficient_tiers",
    );
  if (input.tiers.some((row) => row.length !== 3))
    simpleError(
      "tiers",
      "Each tier must contain from, to, and rate.",
      "invalid_tier_shape",
    );
  const tiers = input.tiers.map(
    ([fromAmount, toAmountOrZeroForUnbounded, ratePercent]) => ({
      fromAmount,
      ratePercent,
      toAmount: toAmountOrZeroForUnbounded,
    }),
  );
  const firstTier = tiers[0];
  if (firstTier === undefined || firstTier.fromAmount !== 0)
    simpleError(
      "tiers",
      "First tier must begin at zero.",
      "tier_start_invalid",
    );
  for (const [index, tier] of tiers.entries()) {
    if (
      !Number.isFinite(tier.fromAmount) ||
      !Number.isFinite(tier.ratePercent) ||
      tier.fromAmount < 0 ||
      tier.ratePercent < 0 ||
      !Number.isFinite(tier.toAmount) ||
      (tier.toAmount !== 0 && tier.toAmount <= tier.fromAmount)
    )
      simpleError(
        "tiers",
        "Tier bounds and rates must be valid.",
        "tier_values_invalid",
      );
    if (tier.toAmount === 0 && index !== tiers.length - 1)
      simpleError(
        "tiers",
        "Only the final tier can be unbounded.",
        "nonfinal_unbounded_tier",
      );
    if (index > 0) {
      const previousTier = tiers[index - 1];
      if (
        previousTier === undefined ||
        tier.fromAmount !== previousTier.toAmount
      )
        simpleError(
          "tiers",
          "Tier bounds must be contiguous and ascending.",
          "noncontiguous_tiers",
        );
    }
  }
  let buyersPremium = 0;
  let appliedTierCount = 0;
  for (const tier of tiers) {
    if (input.hammerPrice <= tier.fromAmount) continue;
    const bandEnd =
      tier.toAmount === 0
        ? input.hammerPrice
        : Math.min(input.hammerPrice, tier.toAmount);
    buyersPremium += ((bandEnd - tier.fromAmount) * tier.ratePercent) / 100;
    appliedTierCount += 1;
  }
  const subtotalBeforeTax = input.hammerPrice + buyersPremium;
  return {
    appliedTierCount,
    buyersPremium,
    subtotalBeforeTax,
    totalBeforeTax: subtotalBeforeTax + input.additionalCharges,
  };
};

export const auctionPremiumExample = {
  input: {
    additionalCharges: 500,
    hammerPrice: 100000,
    tiers: [
      [0, 10000, 25],
      [10000, 0, 20],
    ],
  },
  output: {
    appliedTierCount: 2,
    buyersPremium: 20500,
    subtotalBeforeTax: 120500,
    totalBeforeTax: 121000,
  },
} satisfies ToolExample<AuctionPremiumInput, AuctionPremiumOutput>;

export const auctionPremiumTool = createSimpleTool({
  calculate: (input) =>
    calculateAuctionTieredBuyersPremium({
      additionalCharges: input.additionalCharges as number,
      hammerPrice: input.hammerPrice as number,
      tiers: input.tiers as number[][],
    }),
  description:
    "Apply caller-supplied progressive buyer-premium bands to an auction hammer price and add explicit charges; tax treatment remains outside the calculation.",
  id: "horology/auction-tiered-buyer-premium-calculator",
  inputs: [
    {
      id: "additionalCharges",
      kind: "number",
      label: "Additional charges before tax",
      minimum: 0,
    },
    {
      id: "hammerPrice",
      kind: "number",
      label: "Auction hammer price",
      minimum: 0,
    },
    {
      description:
        "Rows are [from amount, to amount, rate percent]; use zero as the to amount only for the final unbounded tier.",
      id: "tiers",
      kind: "matrix",
      label: "Progressive buyer-premium tiers",
    },
  ],
  outputs: [
    {
      id: "appliedTierCount",
      kind: "integer",
      label: "Applied tier count",
      minimum: 0,
    },
    {
      id: "buyersPremium",
      kind: "number",
      label: "Calculated buyer's premium",
      minimum: 0,
    },
    {
      id: "subtotalBeforeTax",
      kind: "number",
      label: "Hammer plus premium before tax",
      minimum: 0,
    },
    {
      id: "totalBeforeTax",
      kind: "number",
      label: "Total before tax",
      minimum: 0,
    },
  ],
  title: "Auction Tiered Buyer Premium Calculator",
});

export const runAuctionPremium = auctionPremiumTool.execute;
export default auctionPremiumTool;
