import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly totalUnitPrice: number;
  readonly nonScarcityUnitCost: number;
};
export type Output = { readonly scarcityWedge: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    totalUnitPrice: { type: "number" },
    nonScarcityUnitCost: { type: "number" },
  },
  required: ["totalUnitPrice", "nonScarcityUnitCost"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { scarcityWedge: { type: "number" } },
  required: ["scarcityWedge"],
} as const;
/** Subtract an explicit non-scarcity unit cost from a total water unit price on the same currency and volume basis. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { totalUnitPrice, nonScarcityUnitCost } = request;
  const compute = (): Output => {
    return { scarcityWedge: totalUnitPrice - nonScarcityUnitCost };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { totalUnitPrice: 4.5, nonScarcityUnitCost: 2 },
  output: { scarcityWedge: 2.5 },
} satisfies ToolExample<Input, Output>;
export const waterScarcityPriceWedgeTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["cost", "data"],
      fields: [
        "environmental-economics",
        "environmental economics",
        "economics",
      ],
      keywords: ["environmental economics", "economics"],
    },
    id: "environmental-economics/water-scarcity-price-wedge",
    title: "Water Scarcity Price Wedge",
    description:
      "Subtract an explicit non-scarcity unit cost from a total water unit price on the same currency and volume basis.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        totalUnitPrice: { type: "number" },
        nonScarcityUnitCost: { type: "number" },
      },
      required: ["totalUnitPrice", "nonScarcityUnitCost"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { scarcityWedge: { type: "number" } },
      required: ["scarcityWedge"],
    },
    ports: {
      inputs: [
        {
          id: "totalUnitPrice",
          label: "Total Unit Price",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "nonScarcityUnitCost",
          label: "Non Scarcity Unit Cost",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "scarcityWedge",
          label: "Scarcity Wedge",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = waterScarcityPriceWedgeTool.execute;
export default waterScarcityPriceWedgeTool;
