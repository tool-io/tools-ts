import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly bid: number;
  readonly rivalBids: readonly number[];
  readonly reserve: number;
  readonly tieWins: boolean;
};
export type Output = { readonly wins: boolean; readonly payment: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    bid: { type: "number", minimum: 0 },
    rivalBids: { type: "array", maxItems: 256, items: { type: "number" } },
    reserve: { type: "number", minimum: 0 },
    tieWins: { type: "boolean" },
  },
  required: ["bid", "rivalBids", "reserve", "tieWins"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { wins: { type: "boolean" }, payment: { type: "number" } },
  required: ["wins", "payment"],
} as const;
/** Single-unit sealed-bid second-price auction with explicit reserve and tie outcome. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { bid, rivalBids, reserve, tieWins } = request;
  const compute = (): Output => {
    H.domain(
      bid >= 0 &&
        reserve >= 0 &&
        rivalBids.length > 0 &&
        rivalBids.every((x) => x >= 0),
    );
    return {
      wins:
        bid >= reserve &&
        (tieWins
          ? bid >= Math.max(...rivalBids)
          : bid > Math.max(...rivalBids)),
      payment:
        bid >= reserve &&
        (tieWins ? bid >= Math.max(...rivalBids) : bid > Math.max(...rivalBids))
          ? Math.max(reserve, ...rivalBids)
          : 0,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { bid: 10, rivalBids: [6, 8], reserve: 5, tieWins: false },
  output: { wins: true, payment: 8 },
} satisfies ToolExample<Input, Output>;
export const secondPriceAuctionOneBidPaymentTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "game-theory/second-price-auction-one-bid-payment",
    title: "Second Price Auction One Bid Payment Tool",
    description:
      "Single-unit sealed-bid second-price auction with explicit reserve and tie outcome.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        bid: { type: "number", minimum: 0 },
        rivalBids: { type: "array", maxItems: 256, items: { type: "number" } },
        reserve: { type: "number", minimum: 0 },
        tieWins: { type: "boolean" },
      },
      required: ["bid", "rivalBids", "reserve", "tieWins"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { wins: { type: "boolean" }, payment: { type: "number" } },
      required: ["wins", "payment"],
    },
    ports: {
      inputs: [
        {
          id: "bid",
          label: "Bid",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "rivalBids",
          label: "Rival Bids",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "reserve",
          label: "Reserve",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "tieWins",
          label: "Tie Wins",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        { id: "wins", label: "Wins", valueType: { type: "boolean" } },
        { id: "payment", label: "Payment", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = secondPriceAuctionOneBidPaymentTool.execute;
export default secondPriceAuctionOneBidPaymentTool;
