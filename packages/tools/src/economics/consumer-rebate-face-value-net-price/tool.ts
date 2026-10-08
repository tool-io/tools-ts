import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly listedPrice: number;
  readonly suppliedRebate: number;
};
export type Output = {
  readonly netPrice: number;
  readonly rebateExceedsPrice: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    listedPrice: { type: "number", minimum: 0 },
    suppliedRebate: { type: "number", minimum: 0 },
  },
  required: ["listedPrice", "suppliedRebate"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    netPrice: { type: "number" },
    rebateExceedsPrice: { type: "boolean" },
  },
  required: ["netPrice", "rebateExceedsPrice"],
} as const;
/** Subtract an explicit consumer rebate from listed price in the same currency, preserving an excess rebate. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { listedPrice, suppliedRebate } = request;
  const compute = (): Output => {
    H.domain(listedPrice >= 0 && suppliedRebate >= 0, "listedPrice");
    return {
      netPrice: listedPrice - suppliedRebate,
      rebateExceedsPrice: suppliedRebate > listedPrice,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { listedPrice: 100, suppliedRebate: 15 },
  output: { netPrice: 85, rebateExceedsPrice: false },
} satisfies ToolExample<Input, Output>;
export const consumerRebateFaceValueNetPriceTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["cost", "data"],
      fields: ["economics"],
      keywords: ["economics"],
    },
    id: "economics/consumer-rebate-face-value-net-price",
    title: "Consumer Rebate Face Value Net Price",
    description:
      "Subtract an explicit consumer rebate from listed price in the same currency, preserving an excess rebate.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        listedPrice: { type: "number", minimum: 0 },
        suppliedRebate: { type: "number", minimum: 0 },
      },
      required: ["listedPrice", "suppliedRebate"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        netPrice: { type: "number" },
        rebateExceedsPrice: { type: "boolean" },
      },
      required: ["netPrice", "rebateExceedsPrice"],
    },
    ports: {
      inputs: [
        {
          id: "listedPrice",
          label: "Listed Price",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedRebate",
          label: "Supplied Rebate",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "netPrice", label: "Net Price", valueType: { type: "number" } },
        {
          id: "rebateExceedsPrice",
          label: "Rebate Exceeds Price",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = consumerRebateFaceValueNetPriceTool.execute;
export default consumerRebateFaceValueNetPriceTool;
