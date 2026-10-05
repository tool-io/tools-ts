import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly categoryCode: string;
  readonly previousLabel: string;
  readonly currentLabel: string;
};
export type Output = {
  readonly changed: boolean;
  readonly changeLabel: string;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    categoryCode: { type: "string", maxLength: 8192 },
    previousLabel: { type: "string", maxLength: 8192 },
    currentLabel: { type: "string", maxLength: 8192 },
  },
  required: ["categoryCode", "previousLabel", "currentLabel"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    changed: { type: "boolean" },
    changeLabel: { type: "string", maxLength: 8192 },
  },
  required: ["changed", "changeLabel"],
} as const;
/** Document a supplied category-label change across survey waves without assuming category equivalence. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { categoryCode, previousLabel, currentLabel } = request;
  const compute = (): Output => {
    H.domain(categoryCode.length > 0, "categoryCode");
    return {
      changed: previousLabel !== currentLabel,
      changeLabel:
        categoryCode +
        ": " +
        JSON.stringify(previousLabel) +
        " → " +
        JSON.stringify(currentLabel),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    categoryCode: "G3",
    previousLabel: "Other",
    currentLabel: "Self-described",
  },
  output: { changed: true, changeLabel: 'G3: "Other" → "Self-described"' },
} satisfies ToolExample<Input, Output>;
export const genderCategoryWaveLabelChangeTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "gender-studies/gender-category-wave-label-change",
    title: "Gender Category Wave Label Change Tool",
    description:
      "Document a supplied category-label change across survey waves without assuming category equivalence.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        categoryCode: { type: "string", maxLength: 8192 },
        previousLabel: { type: "string", maxLength: 8192 },
        currentLabel: { type: "string", maxLength: 8192 },
      },
      required: ["categoryCode", "previousLabel", "currentLabel"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        changed: { type: "boolean" },
        changeLabel: { type: "string", maxLength: 8192 },
      },
      required: ["changed", "changeLabel"],
    },
    ports: {
      inputs: [
        {
          id: "categoryCode",
          label: "Category Code",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "previousLabel",
          label: "Previous Label",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "currentLabel",
          label: "Current Label",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        { id: "changed", label: "Changed", valueType: { type: "boolean" } },
        {
          id: "changeLabel",
          label: "Change Label",
          valueType: { type: "string" },
        },
      ],
    },
  },
  calculate,
});
export const run = genderCategoryWaveLabelChangeTool.execute;
export default genderCategoryWaveLabelChangeTool;
