import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly category: string;
  readonly referenceCategory: string;
};
export type Output = {
  readonly isReference: boolean;
  readonly indicator: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    category: { type: "string", maxLength: 8192 },
    referenceCategory: { type: "string", maxLength: 8192 },
  },
  required: ["category", "referenceCategory"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    isReference: { type: "boolean" },
    indicator: { type: "integer" },
  },
  required: ["isReference", "indicator"],
} as const;
/** Return a reference-level zero indicator for exact supplied category text without fitting a categorical encoding. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { category, referenceCategory } = request;
  const compute = (): Output => {
    return {
      isReference: category === referenceCategory,
      indicator: category === referenceCategory ? 0 : 1,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { category: "B", referenceCategory: "A" },
  output: { isReference: false, indicator: 1 },
} satisfies ToolExample<Input, Output>;
export const categoryReferenceLevelIndicatorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["encode-decode"],
      fields: ["normalize", "data normalization", "computer science"],
      keywords: ["data normalization", "computer science"],
    },
    id: "normalize/category-reference-level-indicator",
    title: "Category Reference Level Indicator",
    description:
      "Return a reference-level zero indicator for exact supplied category text without fitting a categorical encoding.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        category: { type: "string", maxLength: 8192 },
        referenceCategory: { type: "string", maxLength: 8192 },
      },
      required: ["category", "referenceCategory"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        isReference: { type: "boolean" },
        indicator: { type: "integer" },
      },
      required: ["isReference", "indicator"],
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
          id: "referenceCategory",
          label: "Reference Category",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "isReference",
          label: "Is Reference",
          valueType: { type: "boolean" },
        },
        { id: "indicator", label: "Indicator", valueType: { type: "integer" } },
      ],
    },
  },
  calculate,
});
export const run = categoryReferenceLevelIndicatorTool.execute;
export default categoryReferenceLevelIndicatorTool;
