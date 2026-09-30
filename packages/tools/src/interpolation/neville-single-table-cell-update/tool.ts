import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  domain,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = {
  readonly x: number;
  readonly leftNode: number;
  readonly rightNode: number;
  readonly leftValue: number;
  readonly rightValue: number;
};
export type Output = { readonly value: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    x: { type: "number" },
    leftNode: { type: "number" },
    rightNode: { type: "number" },
    leftValue: { type: "number" },
    rightValue: { type: "number" },
  },
  required: ["x", "leftNode", "rightNode", "leftValue", "rightValue"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { value: { type: "number" } },
  required: ["value"],
} as const;
/** Compute neville single table cell update from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { x, leftNode, rightNode, leftValue, rightValue } = input;
  const compute = (): Output => {
    domain(leftNode !== rightNode);
    return {
      value:
        ((x - rightNode) * leftValue + (leftNode - x) * rightValue) /
        (leftNode - rightNode),
    };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { x: 1, leftNode: 0, rightNode: 2, leftValue: 0, rightValue: 4 },
  output: { value: 2 },
} satisfies ToolExample<Input, Output>;
export const nevilleSingleTableCellUpdateTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "interpolation/neville-single-table-cell-update",
  title: "Neville Single Table Cell Update Tool",
  description:
    "Compute neville single table cell update from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      { id: "x", label: "X", required: true, valueType: { type: "number" } },
      {
        id: "leftNode",
        label: "Left Node",
        required: true,
        valueType: { type: "number" },
      },
      {
        id: "rightNode",
        label: "Right Node",
        required: true,
        valueType: { type: "number" },
      },
      {
        id: "leftValue",
        label: "Left Value",
        required: true,
        valueType: { type: "number" },
      },
      {
        id: "rightValue",
        label: "Right Value",
        required: true,
        valueType: { type: "number" },
      },
    ],
    outputs: [{ id: "value", label: "Value", valueType: { type: "number" } }],
  },
});
export const run = nevilleSingleTableCellUpdateTool.execute;
export default nevilleSingleTableCellUpdateTool;
