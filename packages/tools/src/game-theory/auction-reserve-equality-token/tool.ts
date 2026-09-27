import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly bid: number;
  readonly reserve: number;
  readonly equalityAccepts: boolean;
};
export type Output = {
  readonly acceptedByThreshold: boolean;
  readonly surplus: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    bid: { type: "number", minimum: 0 },
    reserve: { type: "number", minimum: 0 },
    equalityAccepts: { type: "boolean" },
  },
  required: ["bid", "reserve", "equalityAccepts"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    acceptedByThreshold: { type: "boolean" },
    surplus: { type: "number" },
  },
  required: ["acceptedByThreshold", "surplus"],
} as const;
/** One supplied reserve-price equality policy, not an auction winner or payment mechanism. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { bid, reserve, equalityAccepts } = request;
  const compute = (): Output => {
    H.domain(bid >= 0 && reserve >= 0);
    return {
      acceptedByThreshold: equalityAccepts ? bid >= reserve : bid > reserve,
      surplus: bid - reserve,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { bid: 100, reserve: 100, equalityAccepts: true },
  output: { acceptedByThreshold: true, surplus: 0 },
} satisfies ToolExample<Input, Output>;
export const auctionReserveEqualityTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "game-theory/auction-reserve-equality-token",
    title: "Auction Reserve Equality Token Tool",
    description:
      "One supplied reserve-price equality policy, not an auction winner or payment mechanism.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        bid: { type: "number", minimum: 0 },
        reserve: { type: "number", minimum: 0 },
        equalityAccepts: { type: "boolean" },
      },
      required: ["bid", "reserve", "equalityAccepts"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        acceptedByThreshold: { type: "boolean" },
        surplus: { type: "number" },
      },
      required: ["acceptedByThreshold", "surplus"],
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
          id: "reserve",
          label: "Reserve",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "equalityAccepts",
          label: "Equality Accepts",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "acceptedByThreshold",
          label: "Accepted By Threshold",
          valueType: { type: "boolean" },
        },
        { id: "surplus", label: "Surplus", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = auctionReserveEqualityTokenTool.execute;
export default auctionReserveEqualityTokenTool;
