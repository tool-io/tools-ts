import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly category: string;
  readonly referenceCategory: string;
};
export type Output = { readonly dropAsReference: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    category: { type: "string", maxLength: 8192, minLength: 1 },
    referenceCategory: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["category", "referenceCategory"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { dropAsReference: { type: "boolean" } },
  required: ["dropAsReference"],
} as const;
/** Check whether an explicit one-hot category is the supplied reference level to drop without learning category order. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { category, referenceCategory } = request;
  const compute = (): Output => {
    H.domain(category.length > 0, "category");
    H.domain(referenceCategory.length > 0, "referenceCategory");
    return { dropAsReference: category === referenceCategory };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { category: "A", referenceCategory: "A" },
  output: { dropAsReference: true },
} satisfies ToolExample<Input, Output>;
export const oneHotReferenceLevelDropFlagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "data-science/one-hot-reference-level-drop-flag",
    title: "One Hot Reference Level Drop Flag Tool",
    description:
      "Check whether an explicit one-hot category is the supplied reference level to drop without learning category order.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        category: { type: "string", maxLength: 8192, minLength: 1 },
        referenceCategory: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["category", "referenceCategory"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { dropAsReference: { type: "boolean" } },
      required: ["dropAsReference"],
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
          id: "dropAsReference",
          label: "Drop As Reference",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = oneHotReferenceLevelDropFlagTool.execute;
export default oneHotReferenceLevelDropFlagTool;
