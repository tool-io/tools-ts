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
  readonly column: number;
  readonly rows: number;
  readonly columns: number;
};
export type Output = {
  readonly row: number;
  readonly column: number;
  readonly rows: number;
  readonly columns: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    row: { type: "integer", minimum: 0 },
    column: { type: "integer", minimum: 0 },
    rows: { type: "integer", minimum: 1 },
    columns: { type: "integer", minimum: 1 },
  },
  required: ["row", "column", "rows", "columns"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    row: { type: "integer" },
    column: { type: "integer" },
    rows: { type: "integer" },
    columns: { type: "integer" },
  },
  required: ["row", "column", "rows", "columns"],
} as const;
/** Compute matrix one entry transpose address from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { row, column, rows, columns } = input;
  const compute = (): Output => {
    integer(rows, 1);
    integer(columns, 1);
    integer(row, 0, rows - 1);
    integer(column, 0, columns - 1);
    return { row: column, column: row, rows: columns, columns: rows };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { row: 1, column: 2, rows: 3, columns: 4 },
  output: { row: 2, column: 1, rows: 4, columns: 3 },
} satisfies ToolExample<Input, Output>;
export const matrixOneEntryTransposeAddressTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "matrix/matrix-one-entry-transpose-address",
  title: "Matrix One Entry Transpose Address Tool",
  description:
    "Compute matrix one entry transpose address from explicit bounded inputs.",
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
    ],
    outputs: [
      { id: "row", label: "Row", valueType: { type: "integer" } },
      { id: "column", label: "Column", valueType: { type: "integer" } },
      { id: "rows", label: "Rows", valueType: { type: "integer" } },
      { id: "columns", label: "Columns", valueType: { type: "integer" } },
    ],
  },
});
export const run = matrixOneEntryTransposeAddressTool.execute;
export default matrixOneEntryTransposeAddressTool;
