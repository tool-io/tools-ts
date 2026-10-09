import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly bidAmount: number;
  readonly reservePrice: number;
};
export type Output = {
  readonly reserveEligible: boolean;
  readonly firstPriceRevenueContribution: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    bidAmount: { type: "number", minimum: 0 },
    reservePrice: { type: "number", minimum: 0 },
  },
  required: ["bidAmount", "reservePrice"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    reserveEligible: { type: "boolean" },
    firstPriceRevenueContribution: { type: "number" },
  },
  required: ["reserveEligible", "firstPriceRevenueContribution"],
} as const;
/** Check one explicit bid against an inclusive reserve and report its eligible first-price contribution without selecting an auction winner. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { bidAmount, reservePrice } = request;
  const compute = (): Output => {
    H.domain(bidAmount >= 0, "bidAmount");
    H.domain(reservePrice >= 0, "reservePrice");
    return {
      reserveEligible: bidAmount >= reservePrice,
      firstPriceRevenueContribution: bidAmount >= reservePrice ? bidAmount : 0,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { bidAmount: 120, reservePrice: 100 },
  output: { reserveEligible: true, firstPriceRevenueContribution: 120 },
} satisfies ToolExample<Input, Output>;
export const auctionRevenueReserveEligibleBidTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "game-theory/auction-revenue-reserve-eligible-bid",
    title: "Auction Revenue Reserve Eligible Bid Tool",
    description:
      "Check one explicit bid against an inclusive reserve and report its eligible first-price contribution without selecting an auction winner.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        bidAmount: { type: "number", minimum: 0 },
        reservePrice: { type: "number", minimum: 0 },
      },
      required: ["bidAmount", "reservePrice"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        reserveEligible: { type: "boolean" },
        firstPriceRevenueContribution: { type: "number" },
      },
      required: ["reserveEligible", "firstPriceRevenueContribution"],
    },
    ports: {
      inputs: [
        {
          id: "bidAmount",
          label: "Bid Amount",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "reservePrice",
          label: "Reserve Price",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "reserveEligible",
          label: "Reserve Eligible",
          valueType: { type: "boolean" },
        },
        {
          id: "firstPriceRevenueContribution",
          label: "First Price Revenue Contribution",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = auctionRevenueReserveEligibleBidTool.execute;
export default auctionRevenueReserveEligibleBidTool;
