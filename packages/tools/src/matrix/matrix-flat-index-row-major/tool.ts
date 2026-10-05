import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly row: number;
  readonly column: number;
  readonly rows: number;
  readonly columns: number;
};
export type Output = { readonly flatIndex: number };
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
  properties: { flatIndex: { type: "integer" } },
  required: ["flatIndex"],
} as const;
/** Map a zero-based matrix coordinate into a row-major contiguous flat index. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { row, column, rows, columns } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isSafeInteger(rows) &&
        rows >= 1 &&
        rows <= Number.MAX_SAFE_INTEGER,
      "rows",
    ),
      rows);
    (H.domain(
      Number.isSafeInteger(columns) &&
        columns >= 1 &&
        columns <= Number.MAX_SAFE_INTEGER,
      "columns",
    ),
      columns);
    (H.domain(Number.isSafeInteger(row) && row >= 0 && row <= rows - 1, "row"),
      row);
    (H.domain(
      Number.isSafeInteger(column) && column >= 0 && column <= columns - 1,
      "column",
    ),
      column);
    return { flatIndex: row * columns + column };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { row: 2, column: 1, rows: 4, columns: 3 },
  output: { flatIndex: 7 },
} satisfies ToolExample<Input, Output>;
export const matrixFlatIndexRowMajorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "matrix/matrix-flat-index-row-major",
    title: "Matrix Flat Index Row Major Tool",
    description:
      "Map a zero-based matrix coordinate into a row-major contiguous flat index.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        row: { type: "integer", minimum: 0 },
        column: { type: "integer", minimum: 0 },
        rows: { type: "integer", minimum: 1 },
        columns: { type: "integer", minimum: 1 },
      },
      required: ["row", "column", "rows", "columns"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { flatIndex: { type: "integer" } },
      required: ["flatIndex"],
    },
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
        {
          id: "flatIndex",
          label: "Flat Index",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = matrixFlatIndexRowMajorTool.execute;
export default matrixFlatIndexRowMajorTool;
