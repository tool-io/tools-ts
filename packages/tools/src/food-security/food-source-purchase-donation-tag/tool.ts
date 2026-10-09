import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly lotId: string; readonly sourceType: string };
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    lotId: { type: "string", maxLength: 8192, minLength: 1 },
    sourceType: {
      type: "string",
      maxLength: 8192,
      enum: ["purchase", "donation", "transfer", "other", "unspecified"],
    },
  },
  required: ["lotId", "sourceType"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Label an explicitly recorded food-source category without authenticating origin. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { lotId, sourceType } = request;
  const compute = (): Output => {
    H.domain(lotId.length > 0, "lotId");
    H.domain(
      ["purchase", "donation", "transfer", "other", "unspecified"].includes(
        sourceType,
      ),
      "sourceType",
    );
    return { label: lotId + " [" + sourceType + "]" };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { lotId: "LOT17", sourceType: "donation" },
  output: { label: "LOT17 [donation]" },
} satisfies ToolExample<Input, Output>;
export const foodSourcePurchaseDonationTagTool = H.defineSchemaCalculation<
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
    id: "food-security/food-source-purchase-donation-tag",
    title: "Food Source Purchase Donation Tag",
    description:
      "Label an explicitly recorded food-source category without authenticating origin.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        lotId: { type: "string", maxLength: 8192, minLength: 1 },
        sourceType: {
          type: "string",
          maxLength: 8192,
          enum: ["purchase", "donation", "transfer", "other", "unspecified"],
        },
      },
      required: ["lotId", "sourceType"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { label: { type: "string", maxLength: 8192 } },
      required: ["label"],
    },
    ports: {
      inputs: [
        {
          id: "lotId",
          label: "Lot Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "sourceType",
          label: "Source Type",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "label", label: "Label", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = foodSourcePurchaseDonationTagTool.execute;
export default foodSourcePurchaseDonationTagTool;
