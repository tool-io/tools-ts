import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  integer,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = {
  readonly minor: number;
  readonly row: number;
  readonly column: number;
};
export type Output = { readonly derivative: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    minor: { type: "number" },
    row: { type: "integer", minimum: 0 },
    column: { type: "integer", minimum: 0 },
  },
  required: ["minor", "row", "column"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { derivative: { type: "number" } },
  required: ["derivative"],
} as const;
/** Compute matrix determinant single entry sensitivity from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { minor, row, column } = input;
  const compute = (): Output => {
    integer(row);
    integer(column);
    return { derivative: (row + column) % 2 ? -minor : minor };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { minor: 3, row: 1, column: 2 },
  output: { derivative: -3 },
} satisfies ToolExample<Input, Output>;
export const matrixDeterminantSingleEntrySensitivityTool =
  defineSchemaCalculation<Input, Output>({
    id: "matrix/matrix-determinant-single-entry-sensitivity",
    title: "Matrix Determinant Single Entry Sensitivity Tool",
    description:
      "Compute matrix determinant single entry sensitivity from explicit bounded inputs.",
    calculate,
    inputSchema,
    outputSchema,
    ports: {
      inputs: [
        {
          id: "minor",
          label: "Minor",
          required: true,
          valueType: { type: "number" },
        },
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
      outputs: [
        {
          id: "derivative",
          label: "Derivative",
          valueType: { type: "number" },
        },
      ],
    },
  });
export const run = matrixDeterminantSingleEntrySensitivityTool.execute;
export default matrixDeterminantSingleEntrySensitivityTool;
