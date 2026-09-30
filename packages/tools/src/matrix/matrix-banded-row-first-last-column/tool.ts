import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  integer,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = {
  readonly row: number;
  readonly rows: number;
  readonly columns: number;
  readonly lower: number;
  readonly upper: number;
};
export type Output = {
  readonly first: number;
  readonly last: number;
  readonly count: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    row: { type: "integer", minimum: 0 },
    rows: { type: "integer", minimum: 1 },
    columns: { type: "integer", minimum: 1 },
    lower: { type: "integer", minimum: 0 },
    upper: { type: "integer", minimum: 0 },
  },
  required: ["row", "rows", "columns", "lower", "upper"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    first: { type: "integer" },
    last: { type: "integer" },
    count: { type: "integer" },
  },
  required: ["first", "last", "count"],
} as const;
/** Compute matrix banded row first last column from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { row, rows, columns, lower, upper } = input;
  const compute = (): Output => {
    integer(rows, 1);
    integer(columns, 1);
    integer(row, 0, rows - 1);
    integer(lower);
    integer(upper);
    const first = Math.max(0, row - lower),
      last = Math.min(columns - 1, row + upper);
    return { first, last, count: Math.max(0, last - first + 1) };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { row: 0, rows: 5, columns: 5, lower: 1, upper: 2 },
  output: { first: 0, last: 2, count: 3 },
} satisfies ToolExample<Input, Output>;
export const matrixBandedRowFirstLastColumnTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "matrix/matrix-banded-row-first-last-column",
  title: "Matrix Banded Row First Last Column Tool",
  description:
    "Compute matrix banded row first last column from explicit bounded inputs.",
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
        id: "rows",
        label: "Rows",
        required: true,
        valueType: { type: "integer" },
      },
      {
        id: "columns",
        label: "Columns",
        required: true,
        valueType: { type: "integer" },
      },
      {
        id: "lower",
        label: "Lower",
        required: true,
        valueType: { type: "integer" },
      },
      {
        id: "upper",
        label: "Upper",
        required: true,
        valueType: { type: "integer" },
      },
    ],
    outputs: [
      { id: "first", label: "First", valueType: { type: "integer" } },
      { id: "last", label: "Last", valueType: { type: "integer" } },
      { id: "count", label: "Count", valueType: { type: "integer" } },
    ],
  },
});
export const run = matrixBandedRowFirstLastColumnTool.execute;
export default matrixBandedRowFirstLastColumnTool;
