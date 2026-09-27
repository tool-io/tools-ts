import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly bids: readonly number[] };
export type Output = {
  readonly highest: number;
  readonly secondHighest: number;
  readonly gap: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    bids: {
      type: "array",
      maxItems: 256,
      items: { type: "number", minimum: 0 },
    },
  },
  required: ["bids"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    highest: { type: "number" },
    secondHighest: { type: "number" },
    gap: { type: "number" },
  },
  required: ["highest", "secondHighest", "gap"],
} as const;
/** Inspect supplied bids under second-price order statistics without reserve prices or tie allocation. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { bids } = request;
  const compute = (): Output => {
    H.domain(bids.length >= 2 && bids.every((x) => x >= 0));
    const a = [...bids].sort((a, b) => b - a);
    return { highest: a[0], secondHighest: a[1], gap: a[0] - a[1] };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { bids: [10, 7, 5] },
  output: { highest: 10, secondHighest: 7, gap: 3 },
} satisfies ToolExample<Input, Output>;
export const auctionSecondPriceGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "game-theory/auction-second-price-gap",
    title: "Auction Second Price Gap Tool",
    description:
      "Inspect supplied bids under second-price order statistics without reserve prices or tie allocation.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        bids: {
          type: "array",
          maxItems: 256,
          items: { type: "number", minimum: 0 },
        },
      },
      required: ["bids"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        highest: { type: "number" },
        secondHighest: { type: "number" },
        gap: { type: "number" },
      },
      required: ["highest", "secondHighest", "gap"],
    },
    ports: {
      inputs: [
        {
          id: "bids",
          label: "Bids",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
      ],
      outputs: [
        { id: "highest", label: "Highest", valueType: { type: "number" } },
        {
          id: "secondHighest",
          label: "Second Highest",
          valueType: { type: "number" },
        },
        { id: "gap", label: "Gap", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = auctionSecondPriceGapTool.execute;
export default auctionSecondPriceGapTool;
