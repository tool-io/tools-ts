import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type AuctionBuyerPremiumTotalInput = Readonly<{
  readonly hammerPrice: number;
  readonly buyerPremiumPercent: number;
}>;
export type AuctionBuyerPremiumTotalOutput = Readonly<{
  readonly totalBeforeTax: number;
}>;

export const calculateAuctionBuyerPremiumTotal = (
  x: AuctionBuyerPremiumTotalInput,
): AuctionBuyerPremiumTotalOutput => {
  if (!Number.isFinite(x.hammerPrice) || x.hammerPrice < 0)
    simpleError("hammerPrice", "Provide a finite nonnegative number.");
  if (!Number.isFinite(x.buyerPremiumPercent) || x.buyerPremiumPercent < 0)
    simpleError("buyerPremiumPercent", "Provide a finite nonnegative number.");
  const totalBeforeTax = x.hammerPrice * (1 + x.buyerPremiumPercent / 100);
  if (!Number.isFinite(totalBeforeTax))
    simpleError(
      "totalBeforeTax",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { totalBeforeTax: Object.is(totalBeforeTax, -0) ? 0 : totalBeforeTax };
};

export const example = {
  input: {
    hammerPrice: 100,
    buyerPremiumPercent: 20,
  },
  output: { totalBeforeTax: 120 },
} satisfies ToolExample<
  AuctionBuyerPremiumTotalInput,
  AuctionBuyerPremiumTotalOutput
>;

export const tool = createSimpleTool({
  id: "numismatics/auction-buyer-premium-total",
  title: "Auction Buyer Premium Total",
  description:
    "Add the auction buyer's premium to the hammer price; shipping and tax are excluded.",
  inputs: [
    {
      id: "hammerPrice",
      kind: "number",
      label: "Hammer Price",
      unit: "currency",
    },
    {
      id: "buyerPremiumPercent",
      kind: "number",
      label: "Buyer Premium Percent",
      unit: "%",
    },
  ],
  outputs: [
    {
      id: "totalBeforeTax",
      kind: "number",
      label: "Total Before Tax",
      unit: "currency",
    },
  ],
  calculate: (input) =>
    calculateAuctionBuyerPremiumTotal({
      hammerPrice: input.hammerPrice as number,
      buyerPremiumPercent: input.buyerPremiumPercent as number,
    }),
});
export const runAuctionBuyerPremiumTotal = tool.execute;
export default tool;
