import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly productId: string;
  readonly ingredientWording: string;
  readonly labelVersion: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    productId: { type: "string", maxLength: 8192, minLength: 1 },
    ingredientWording: { type: "string", maxLength: 8192, minLength: 1 },
    labelVersion: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["productId", "ingredientWording", "labelVersion"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Qualify an explicit over-the-counter ingredient label by version without assessing safety or interactions. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { productId, ingredientWording, labelVersion } = request;
  const compute = (): Output => {
    H.domain(productId.length > 0, "productId");
    H.domain(ingredientWording.length > 0, "ingredientWording");
    H.domain(labelVersion.length > 0, "labelVersion");
    return {
      token: JSON.stringify([productId, ingredientWording, labelVersion]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    productId: "PR17",
    ingredientWording: "Ingredient A",
    labelVersion: "v2",
  },
  output: { token: '["PR17","Ingredient A","v2"]' },
} satisfies ToolExample<Input, Output>;
export const otcLabelIngredientNamespaceTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["community-pharmacy", "community pharmacy", "pharmacy"],
      keywords: ["community pharmacy", "pharmacy"],
    },
    id: "community-pharmacy/otc-label-ingredient-namespace",
    title: "OTC Label Ingredient Namespace",
    description:
      "Qualify an explicit over-the-counter ingredient label by version without assessing safety or interactions.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        productId: { type: "string", maxLength: 8192, minLength: 1 },
        ingredientWording: { type: "string", maxLength: 8192, minLength: 1 },
        labelVersion: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["productId", "ingredientWording", "labelVersion"],
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
          id: "ingredientWording",
          label: "Ingredient Wording",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "labelVersion",
          label: "Label Version",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = otcLabelIngredientNamespaceTool.execute;
export default otcLabelIngredientNamespaceTool;
