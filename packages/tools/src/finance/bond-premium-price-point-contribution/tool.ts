import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly pricePerHundred: number;
  readonly faceAmount: number;
};
export type Output = { readonly premiumAmount: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    pricePerHundred: { type: "number", minimum: 0 },
    faceAmount: { type: "number", minimum: 0 },
  },
  required: ["pricePerHundred", "faceAmount"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { premiumAmount: { type: "number" } },
  required: ["premiumAmount"],
} as const;
/** Convert an explicit quoted bond premium or discount per hundred into a face-amount contribution without valuing cash flows. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { pricePerHundred, faceAmount } = request;
  const compute = (): Output => {
    H.domain(pricePerHundred >= 0 && faceAmount >= 0, "pricePerHundred");
    return { premiumAmount: (pricePerHundred / 100 - 1) * faceAmount };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { pricePerHundred: 105, faceAmount: 1000 },
  output: { premiumAmount: 50.00000000000004 },
} satisfies ToolExample<Input, Output>;
export const bondPremiumPricepointContributionTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["cost", "data", "trading"],
      fields: ["finance", "business and finance"],
      keywords: ["finance", "business and finance"],
    },
    id: "finance/bond-premium-price-point-contribution",
    title: "Bond Premium Price Point Contribution",
    description:
      "Convert an explicit quoted bond premium or discount per hundred into a face-amount contribution without valuing cash flows.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        pricePerHundred: { type: "number", minimum: 0 },
        faceAmount: { type: "number", minimum: 0 },
      },
      required: ["pricePerHundred", "faceAmount"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { premiumAmount: { type: "number" } },
      required: ["premiumAmount"],
    },
    ports: {
      inputs: [
        {
          id: "pricePerHundred",
          label: "Price Per Hundred",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "faceAmount",
          label: "Face Amount",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "premiumAmount",
          label: "Premium Amount",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = bondPremiumPricepointContributionTool.execute;
export default bondPremiumPricepointContributionTool;
