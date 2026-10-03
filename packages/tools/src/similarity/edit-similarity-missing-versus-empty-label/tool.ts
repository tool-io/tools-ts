import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = {
  readonly left: string;
  readonly right: string;
  readonly leftMissing: boolean;
  readonly rightMissing: boolean;
};
export type Output = {
  readonly comparable: boolean;
  readonly bothEmpty: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    left: { type: "string", maxLength: 8192 },
    right: { type: "string", maxLength: 8192 },
    leftMissing: { type: "boolean" },
    rightMissing: { type: "boolean" },
  },
  required: ["left", "right", "leftMissing", "rightMissing"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    comparable: { type: "boolean" },
    bothEmpty: { type: "boolean" },
  },
  required: ["comparable", "bothEmpty"],
} as const;
/** Compute edit similarity missing versus empty label from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { left, right, leftMissing, rightMissing } = input;
  const compute = (): Output => {
    return {
      comparable: !leftMissing && !rightMissing,
      bothEmpty: !leftMissing && !rightMissing && left === "" && right === "",
    };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { left: "", right: "", leftMissing: false, rightMissing: false },
  output: { comparable: true, bothEmpty: true },
} satisfies ToolExample<Input, Output>;
export const editSimilarityMissingVersusEmptyLabelTool =
  defineSchemaCalculation<Input, Output>({
    id: "similarity/edit-similarity-missing-versus-empty-label",
    title: "Edit Similarity Missing Versus Empty Label Tool",
    description:
      "Compute edit similarity missing versus empty label from explicit bounded inputs.",
    calculate,
    inputSchema,
    outputSchema,
    ports: {
      inputs: [
        {
          id: "left",
          label: "Left",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "right",
          label: "Right",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "leftMissing",
          label: "Left Missing",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "rightMissing",
          label: "Right Missing",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "comparable",
          label: "Comparable",
          valueType: { type: "boolean" },
        },
        {
          id: "bothEmpty",
          label: "Both Empty",
          valueType: { type: "boolean" },
        },
      ],
    },
  });
export const run = editSimilarityMissingVersusEmptyLabelTool.execute;
export default editSimilarityMissingVersusEmptyLabelTool;
