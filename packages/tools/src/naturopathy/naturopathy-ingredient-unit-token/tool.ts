import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly productId: string;
  readonly ingredientWording: string;
  readonly unitText: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    productId: { type: "string", maxLength: 8192, minLength: 1 },
    ingredientWording: { type: "string", maxLength: 8192, minLength: 1 },
    unitText: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["productId", "ingredientWording", "unitText"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Qualify supplied ingredient and unit wording without recommending use or dosage. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { productId, ingredientWording, unitText } = request;
  const compute = (): Output => {
    H.domain(productId.length > 0, "productId");
    H.domain(ingredientWording.length > 0, "ingredientWording");
    H.domain(unitText.length > 0, "unitText");
    return { token: JSON.stringify([productId, ingredientWording, unitText]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    productId: "PR17",
    ingredientWording: "Ingredient A",
    unitText: "mg",
  },
  output: { token: '["PR17","Ingredient A","mg"]' },
} satisfies ToolExample<Input, Output>;
export const naturopathyIngredientUnitTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["naturopathy", "health and medicine"],
      keywords: ["naturopathy", "health and medicine"],
    },
    id: "naturopathy/naturopathy-ingredient-unit-token",
    title: "Naturopathy Ingredient Unit Token",
    description:
      "Qualify supplied ingredient and unit wording without recommending use or dosage.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        productId: { type: "string", maxLength: 8192, minLength: 1 },
        ingredientWording: { type: "string", maxLength: 8192, minLength: 1 },
        unitText: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["productId", "ingredientWording", "unitText"],
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
          id: "unitText",
          label: "Unit Text",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = naturopathyIngredientUnitTokenTool.execute;
export default naturopathyIngredientUnitTokenTool;
