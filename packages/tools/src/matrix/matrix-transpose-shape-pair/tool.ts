import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly rows: number; readonly columns: number };
export type Output = {
  readonly transposedRows: number;
  readonly transposedColumns: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    rows: { type: "integer", minimum: 0 },
    columns: { type: "integer", minimum: 0 },
  },
  required: ["rows", "columns"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    transposedRows: { type: "integer" },
    transposedColumns: { type: "integer" },
  },
  required: ["transposedRows", "transposedColumns"],
} as const;
/** Return the transposed shape of a matrix from explicit nonnegative dimensions, including empty dimensions. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { rows, columns } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isSafeInteger(rows) &&
        rows >= 0 &&
        rows <= Number.MAX_SAFE_INTEGER,
      "rows",
    ),
      rows);
    (H.domain(
      Number.isSafeInteger(columns) &&
        columns >= 0 &&
        columns <= Number.MAX_SAFE_INTEGER,
      "columns",
    ),
      columns);
    return { transposedRows: columns, transposedColumns: rows };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { rows: 3, columns: 5 },
  output: { transposedRows: 5, transposedColumns: 3 },
} satisfies ToolExample<Input, Output>;
export const matrixTransposeShapePairTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "matrix/matrix-transpose-shape-pair",
    title: "Matrix Transpose Shape Pair Tool",
    description:
      "Return the transposed shape of a matrix from explicit nonnegative dimensions, including empty dimensions.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        rows: { type: "integer", minimum: 0 },
        columns: { type: "integer", minimum: 0 },
      },
      required: ["rows", "columns"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        transposedRows: { type: "integer" },
        transposedColumns: { type: "integer" },
      },
      required: ["transposedRows", "transposedColumns"],
    },
    ports: {
      inputs: [
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
          id: "transposedRows",
          label: "Transposed Rows",
          valueType: { type: "integer" },
        },
        {
          id: "transposedColumns",
          label: "Transposed Columns",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = matrixTransposeShapePairTool.execute;
export default matrixTransposeShapePairTool;
