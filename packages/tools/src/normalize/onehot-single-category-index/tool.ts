import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly categories: readonly string[];
  readonly category: string;
};
export type Output = {
  readonly index: number;
  readonly oneHot: readonly number[];
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    categories: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    category: { type: "string", maxLength: 8192 },
  },
  required: ["categories", "category"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    index: { type: "integer" },
    oneHot: { type: "array", maxItems: 256, items: { type: "integer" } },
  },
  required: ["index", "oneHot"],
} as const;
/** Encode one exact string category against an explicit ordered unique category vocabulary; unknown categories are rejected. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { categories, category } = request;
  const compute = (): Output => {
    H.domain(new Set(categories).size === categories.length, "categories");
    const index = categories.indexOf(category);
    H.domain(index >= 0, "category");
    return { index, oneHot: categories.map((_, i) => (i === index ? 1 : 0)) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { categories: ["red", "green", "blue"], category: "green" },
  output: { index: 1, oneHot: [0, 1, 0] },
} satisfies ToolExample<Input, Output>;
export const onehotSingleCategoryIndexTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "normalize/onehot-single-category-index",
    title: "Onehot Single Category Index Tool",
    description:
      "Encode one exact string category against an explicit ordered unique category vocabulary; unknown categories are rejected.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        categories: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        category: { type: "string", maxLength: 8192 },
      },
      required: ["categories", "category"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        index: { type: "integer" },
        oneHot: { type: "array", maxItems: 256, items: { type: "integer" } },
      },
      required: ["index", "oneHot"],
    },
    ports: {
      inputs: [
        {
          id: "categories",
          label: "Categories",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "category",
          label: "Category",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        { id: "index", label: "Index", valueType: { type: "integer" } },
        {
          id: "oneHot",
          label: "One Hot",
          valueType: { type: "list", items: { type: "integer" } },
        },
      ],
    },
  },
  calculate,
});
export const run = onehotSingleCategoryIndexTool.execute;
export default onehotSingleCategoryIndexTool;
