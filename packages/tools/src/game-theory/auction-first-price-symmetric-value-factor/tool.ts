import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly value: number;
  readonly bidders: number;
  readonly lowerValueBound: number;
};
export type Output = { readonly bid: number; readonly shading: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    value: { type: "number" },
    bidders: { type: "integer", minimum: 2 },
    lowerValueBound: { type: "number" },
  },
  required: ["value", "bidders", "lowerValueBound"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { bid: { type: "number" }, shading: { type: "number" } },
  required: ["bid", "shading"],
} as const;
/** Risk-neutral symmetric independent private values uniformly distributed on a common interval, no reserve; caller value lies in that interval. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { value, bidders, lowerValueBound } = request;
  const compute = (): Output => {
    H.integer(bidders, 2);
    H.domain(value >= lowerValueBound);
    return {
      bid:
        lowerValueBound + ((value - lowerValueBound) * (bidders - 1)) / bidders,
      shading: (value - lowerValueBound) / bidders,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { value: 100, bidders: 4, lowerValueBound: 0 },
  output: { bid: 75, shading: 25 },
} satisfies ToolExample<Input, Output>;
export const auctionFirstPriceSymmetricValueFactorTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "game-theory/auction-first-price-symmetric-value-factor",
      title: "Auction First Price Symmetric Value Factor Tool",
      description:
        "Risk-neutral symmetric independent private values uniformly distributed on a common interval, no reserve; caller value lies in that interval.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          value: { type: "number" },
          bidders: { type: "integer", minimum: 2 },
          lowerValueBound: { type: "number" },
        },
        required: ["value", "bidders", "lowerValueBound"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { bid: { type: "number" }, shading: { type: "number" } },
        required: ["bid", "shading"],
      },
      ports: {
        inputs: [
          {
            id: "value",
            label: "Value",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "bidders",
            label: "Bidders",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "lowerValueBound",
            label: "Lower Value Bound",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          { id: "bid", label: "Bid", valueType: { type: "number" } },
          { id: "shading", label: "Shading", valueType: { type: "number" } },
        ],
      },
    },
    calculate,
  });
export const run = auctionFirstPriceSymmetricValueFactorTool.execute;
export default auctionFirstPriceSymmetricValueFactorTool;
