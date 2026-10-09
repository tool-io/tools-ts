import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly requiredQuantity: number;
  readonly availableQuantity: number;
};
export type Output = { readonly shortfall: number; readonly surplus: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    requiredQuantity: { type: "number", minimum: 0 },
    availableQuantity: { type: "number", minimum: 0 },
  },
  required: ["requiredQuantity", "availableQuantity"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { shortfall: { type: "number" }, surplus: { type: "number" } },
  required: ["shortfall", "surplus"],
} as const;
/** Compare explicit compatible food-parcel component quantities without prescribing nutritional requirements. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { requiredQuantity, availableQuantity } = request;
  const compute = (): Output => {
    H.domain(
      requiredQuantity >= 0 && availableQuantity >= 0,
      "requiredQuantity",
    );
    return {
      shortfall: Math.max(0, requiredQuantity - availableQuantity),
      surplus: Math.max(0, availableQuantity - requiredQuantity),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { requiredQuantity: 12, availableQuantity: 8 },
  output: { shortfall: 4, surplus: 0 },
} satisfies ToolExample<Input, Output>;
export const foodParcelComponentShortfallTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["food-security", "food security", "agriculture"],
      keywords: ["food security", "agriculture"],
    },
    id: "food-security/food-parcel-component-shortfall",
    title: "Food Parcel Component Shortfall",
    description:
      "Compare explicit compatible food-parcel component quantities without prescribing nutritional requirements.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        requiredQuantity: { type: "number", minimum: 0 },
        availableQuantity: { type: "number", minimum: 0 },
      },
      required: ["requiredQuantity", "availableQuantity"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        shortfall: { type: "number" },
        surplus: { type: "number" },
      },
      required: ["shortfall", "surplus"],
    },
    ports: {
      inputs: [
        {
          id: "requiredQuantity",
          label: "Required Quantity",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "availableQuantity",
          label: "Available Quantity",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "shortfall", label: "Shortfall", valueType: { type: "number" } },
        { id: "surplus", label: "Surplus", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = foodParcelComponentShortfallTool.execute;
export default foodParcelComponentShortfallTool;
