import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  integer,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = { readonly row: number; readonly column: number };
export type Output = { readonly value: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    row: { type: "integer", minimum: 0 },
    column: { type: "integer", minimum: 0 },
  },
  required: ["row", "column"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { value: { type: "integer" } },
  required: ["value"],
} as const;
/** Compute matrix kronecker delta entry from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { row, column } = input;
  const compute = (): Output => {
    integer(row);
    integer(column);
    return { value: row === column ? 1 : 0 };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { row: 3, column: 3 },
  output: { value: 1 },
} satisfies ToolExample<Input, Output>;
export const matrixKroneckerDeltaEntryTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "matrix/matrix-kronecker-delta-entry",
  title: "Matrix Kronecker Delta Entry Tool",
  description:
    "Compute matrix kronecker delta entry from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "row",
        label: "Row",
        required: true,
        valueType: { type: "integer" },
      },
      {
        id: "column",
        label: "Column",
        required: true,
        valueType: { type: "integer" },
      },
    ],
    outputs: [{ id: "value", label: "Value", valueType: { type: "integer" } }],
  },
});
export const run = matrixKroneckerDeltaEntryTool.execute;
export default matrixKroneckerDeltaEntryTool;
