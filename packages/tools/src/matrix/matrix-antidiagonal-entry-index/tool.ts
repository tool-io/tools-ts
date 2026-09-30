import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly rows: number;
  readonly columns: number;
  readonly position: number;
  readonly origin: number;
};
export type Output = { readonly row: number; readonly column: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    rows: { type: "integer", minimum: 1 },
    columns: { type: "integer", minimum: 1 },
    position: { type: "integer" },
    origin: { type: "integer" },
  },
  required: ["rows", "columns", "position", "origin"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { row: { type: "integer" }, column: { type: "integer" } },
  required: ["row", "column"],
} as const;
/** Map one top-right-to-bottom-left anti-diagonal entry in a rectangular matrix under an explicit index origin. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { rows, columns, position, origin } = request;
  const compute = (): Output => {
    H.domain(origin === 0 || origin === 1);
    H.integer(rows, 1);
    H.integer(columns, 1);
    H.integer(position, origin, origin + Math.min(rows, columns) - 1);
    return {
      row: position,
      column: origin + columns - 1 - (position - origin),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { rows: 3, columns: 4, position: 2, origin: 1 },
  output: { row: 2, column: 3 },
} satisfies ToolExample<Input, Output>;
export const matrixAntidiagonalEntryIndexTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "matrix/matrix-antidiagonal-entry-index",
    title: "Matrix Antidiagonal Entry Index Tool",
    description:
      "Map one top-right-to-bottom-left anti-diagonal entry in a rectangular matrix under an explicit index origin.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        rows: { type: "integer", minimum: 1 },
        columns: { type: "integer", minimum: 1 },
        position: { type: "integer" },
        origin: { type: "integer" },
      },
      required: ["rows", "columns", "position", "origin"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { row: { type: "integer" }, column: { type: "integer" } },
      required: ["row", "column"],
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
        {
          id: "position",
          label: "Position",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "origin",
          label: "Origin",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "row", label: "Row", valueType: { type: "integer" } },
        { id: "column", label: "Column", valueType: { type: "integer" } },
      ],
    },
  },
  calculate,
});
export const run = matrixAntidiagonalEntryIndexTool.execute;
export default matrixAntidiagonalEntryIndexTool;
