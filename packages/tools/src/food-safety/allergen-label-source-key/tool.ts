import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly productId: string;
  readonly allergenWording: string;
  readonly labelSource: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    productId: { type: "string", maxLength: 8192, minLength: 1 },
    allergenWording: { type: "string", maxLength: 8192, minLength: 1 },
    labelSource: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["productId", "allergenWording", "labelSource"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Preserve explicit allergen-label wording and source without detecting allergens or assessing safety. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { productId, allergenWording, labelSource } = request;
  const compute = (): Output => {
    H.domain(productId.length > 0, "productId");
    H.domain(allergenWording.length > 0, "allergenWording");
    H.domain(labelSource.length > 0, "labelSource");
    return { token: JSON.stringify([productId, allergenWording, labelSource]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    productId: "PR17",
    allergenWording: "contains ingredient A",
    labelSource: "Label v2",
  },
  output: { token: '["PR17","contains ingredient A","Label v2"]' },
} satisfies ToolExample<Input, Output>;
export const allergenLabelSourceKeyTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["food-safety", "food safety", "research and quality management"],
      keywords: ["food safety", "research and quality management"],
    },
    id: "food-safety/allergen-label-source-key",
    title: "Allergen Label Source Key",
    description:
      "Preserve explicit allergen-label wording and source without detecting allergens or assessing safety.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        productId: { type: "string", maxLength: 8192, minLength: 1 },
        allergenWording: { type: "string", maxLength: 8192, minLength: 1 },
        labelSource: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["productId", "allergenWording", "labelSource"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { token: { type: "string", maxLength: 8192 } },
      required: ["token"],
    },
    ports: {
      inputs: [
        {
          id: "productId",
          label: "Product Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "allergenWording",
          label: "Allergen Wording",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "labelSource",
          label: "Label Source",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = allergenLabelSourceKeyTool.execute;
export default allergenLabelSourceKeyTool;
