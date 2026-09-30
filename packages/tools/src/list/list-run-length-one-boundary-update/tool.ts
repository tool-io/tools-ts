import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly leftValue: string;
  readonly leftLength: number;
  readonly rightValue: string;
  readonly rightLength: number;
};
export type Output = {
  readonly merged: boolean;
  readonly lengths: readonly number[];
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    leftValue: { type: "string", maxLength: 8192 },
    leftLength: { type: "integer", minimum: 1 },
    rightValue: { type: "string", maxLength: 8192 },
    rightLength: { type: "integer", minimum: 1 },
  },
  required: ["leftValue", "leftLength", "rightValue", "rightLength"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    merged: { type: "boolean" },
    lengths: { type: "array", maxItems: 256, items: { type: "integer" } },
  },
  required: ["merged", "lengths"],
} as const;
/** Calculate list run length one boundary update from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { leftValue, leftLength, rightValue, rightLength } = input;
  const compute = (): Output => {
    H.integer(leftLength, 1);
    H.integer(rightLength, 1);
    return {
      merged: leftValue === rightValue,
      lengths:
        leftValue === rightValue
          ? [leftLength + rightLength]
          : [leftLength, rightLength],
    };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { leftValue: "a", leftLength: 2, rightValue: "a", rightLength: 3 },
  output: { merged: true, lengths: [5] },
} satisfies ToolExample<Input, Output>;
export const listRunLengthOneBoundaryUpdateTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "list/list-run-length-one-boundary-update",
    title: "List Run Length One Boundary Update Tool",
    description:
      "Calculate list run length one boundary update from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        leftValue: { type: "string", maxLength: 8192 },
        leftLength: { type: "integer", minimum: 1 },
        rightValue: { type: "string", maxLength: 8192 },
        rightLength: { type: "integer", minimum: 1 },
      },
      required: ["leftValue", "leftLength", "rightValue", "rightLength"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        merged: { type: "boolean" },
        lengths: { type: "array", maxItems: 256, items: { type: "integer" } },
      },
      required: ["merged", "lengths"],
    },
    ports: {
      inputs: [
        {
          id: "leftValue",
          label: "Left Value",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "leftLength",
          label: "Left Length",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "rightValue",
          label: "Right Value",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "rightLength",
          label: "Right Length",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "merged", label: "Merged", valueType: { type: "boolean" } },
        {
          id: "lengths",
          label: "Lengths",
          valueType: { type: "list", items: { type: "integer" } },
        },
      ],
    },
  },
  calculate,
});
export const run = listRunLengthOneBoundaryUpdateTool.execute;
export default listRunLengthOneBoundaryUpdateTool;
