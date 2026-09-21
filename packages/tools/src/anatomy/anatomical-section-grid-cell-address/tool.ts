import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly row: number;
  readonly column: number;
  readonly columns: number;
  readonly rows: number;
};
export type Output = {
  readonly rowMajorIndex: number;
  readonly cellsRemaining: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    row: { type: "integer", minimum: 0 },
    column: { type: "integer", minimum: 0 },
    columns: { type: "integer", minimum: 1 },
    rows: { type: "integer", minimum: 1 },
  },
  required: ["row", "column", "columns", "rows"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    rowMajorIndex: { type: "integer" },
    cellsRemaining: { type: "integer" },
  },
  required: ["rowMajorIndex", "cellsRemaining"],
} as const;
/** Calculate anatomical section grid cell address from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { row, column, columns, rows } = request;
  const compute = (): Output => {
    H.integer(columns, 1);
    H.integer(rows, 1);
    H.integer(row, 0, rows - 1);
    H.integer(column, 0, columns - 1);
    return {
      rowMajorIndex: row * columns + column,
      cellsRemaining: rows * columns - row * columns - column - 1,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { row: 2, column: 3, columns: 5, rows: 4 },
  output: { rowMajorIndex: 13, cellsRemaining: 6 },
} satisfies ToolExample<Input, Output>;
export const anatomicalSectionGridCellAddressTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "anatomy/anatomical-section-grid-cell-address",
    title: "Anatomical Section Grid Cell Address Tool",
    description:
      "Calculate anatomical section grid cell address from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        row: { type: "integer", minimum: 0 },
        column: { type: "integer", minimum: 0 },
        columns: { type: "integer", minimum: 1 },
        rows: { type: "integer", minimum: 1 },
      },
      required: ["row", "column", "columns", "rows"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        rowMajorIndex: { type: "integer" },
        cellsRemaining: { type: "integer" },
      },
      required: ["rowMajorIndex", "cellsRemaining"],
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
          id: "columns",
          label: "Columns",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "rows",
          label: "Rows",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "rowMajorIndex",
          label: "Row Major Index",
          valueType: { type: "integer" },
        },
        {
          id: "cellsRemaining",
          label: "Cells Remaining",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = anatomicalSectionGridCellAddressTool.execute;
export default anatomicalSectionGridCellAddressTool;
