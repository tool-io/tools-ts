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
  readonly rightRows: number;
  readonly rightColumns: number;
};
export type Output = {
  readonly leftRow: number;
  readonly leftColumn: number;
  readonly rightRow: number;
  readonly rightColumn: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    row: { type: "integer", minimum: 0 },
    column: { type: "integer", minimum: 0 },
    rightRows: { type: "integer", minimum: 1 },
    rightColumns: { type: "integer", minimum: 1 },
  },
  required: ["row", "column", "rightRows", "rightColumns"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    leftRow: { type: "integer" },
    leftColumn: { type: "integer" },
    rightRow: { type: "integer" },
    rightColumn: { type: "integer" },
  },
  required: ["leftRow", "leftColumn", "rightRow", "rightColumn"],
} as const;
/** Compute matrix kron entry factor index from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { row, column, rightRows, rightColumns } = input;
  const compute = (): Output => {
    integer(row);
    integer(column);
    integer(rightRows, 1);
    integer(rightColumns, 1);
    return {
      leftRow: Math.floor(row / rightRows),
      leftColumn: Math.floor(column / rightColumns),
      rightRow: row % rightRows,
      rightColumn: column % rightColumns,
    };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { row: 5, column: 7, rightRows: 2, rightColumns: 3 },
  output: { leftRow: 2, leftColumn: 2, rightRow: 1, rightColumn: 1 },
} satisfies ToolExample<Input, Output>;
export const matrixKronEntryFactorIndexTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "matrix/matrix-kron-entry-factor-index",
  title: "Matrix Kron Entry Factor Index Tool",
  description:
    "Compute matrix kron entry factor index from explicit bounded inputs.",
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
        id: "rightRows",
        label: "Right Rows",
        required: true,
        valueType: { type: "integer" },
      },
      {
        id: "rightColumns",
        label: "Right Columns",
        required: true,
        valueType: { type: "integer" },
      },
    ],
    outputs: [
      { id: "leftRow", label: "Left Row", valueType: { type: "integer" } },
      {
        id: "leftColumn",
        label: "Left Column",
        valueType: { type: "integer" },
      },
      { id: "rightRow", label: "Right Row", valueType: { type: "integer" } },
      {
        id: "rightColumn",
        label: "Right Column",
        valueType: { type: "integer" },
      },
    ],
  },
});
export const run = matrixKronEntryFactorIndexTool.execute;
export default matrixKronEntryFactorIndexTool;
