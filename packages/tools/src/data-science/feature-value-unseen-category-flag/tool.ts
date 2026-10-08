import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly category: string;
  readonly trainingCategories: readonly string[];
};
export type Output = { readonly unseen: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    category: { type: "string", maxLength: 8192 },
    trainingCategories: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["category", "trainingCategories"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { unseen: { type: "boolean" } },
  required: ["unseen"],
} as const;
/** Identify an exact feature category absent from an explicitly supplied training vocabulary without recoding it. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { category, trainingCategories } = request;
  const compute = (): Output => {
    return { unseen: !trainingCategories.includes(category) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { category: "new", trainingCategories: ["a", "b"] },
  output: { unseen: true },
} satisfies ToolExample<Input, Output>;
export const featureValueUnseenCategoryFlagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["data-science", "data science", "computer science"],
      keywords: ["data science", "computer science"],
    },
    id: "data-science/feature-value-unseen-category-flag",
    title: "Feature Value Unseen Category Flag",
    description:
      "Identify an exact feature category absent from an explicitly supplied training vocabulary without recoding it.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        category: { type: "string", maxLength: 8192 },
        trainingCategories: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
      },
      required: ["category", "trainingCategories"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { unseen: { type: "boolean" } },
      required: ["unseen"],
    },
    ports: {
      inputs: [
        {
          id: "category",
          label: "Category",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "trainingCategories",
          label: "Training Categories",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
      ],
      outputs: [
        { id: "unseen", label: "Unseen", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = featureValueUnseenCategoryFlagTool.execute;
export default featureValueUnseenCategoryFlagTool;
