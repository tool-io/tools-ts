import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly cellWidth: number;
  readonly cellHeight: number;
  readonly columns: number;
  readonly rows: number;
};
export type Output = {
  readonly diagonal: number;
  readonly gridWidth: number;
  readonly gridHeight: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    cellWidth: { type: "number", minimum: 0 },
    cellHeight: { type: "number", minimum: 0 },
    columns: { type: "integer", minimum: 0 },
    rows: { type: "integer", minimum: 0 },
  },
  required: ["cellWidth", "cellHeight", "columns", "rows"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    diagonal: { type: "number" },
    gridWidth: { type: "number" },
    gridHeight: { type: "number" },
  },
  required: ["diagonal", "gridWidth", "gridHeight"],
} as const;
/** Calculate drawing grid cell diagonal reference from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { cellWidth, cellHeight, columns, rows } = request;
  const compute = (): Output => {
    H.domain(cellWidth >= 0 && cellHeight >= 0);
    H.integer(columns, 0);
    H.integer(rows, 0);
    return {
      diagonal: Math.hypot(cellWidth, cellHeight),
      gridWidth: cellWidth * columns,
      gridHeight: cellHeight * rows,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { cellWidth: 3, cellHeight: 4, columns: 5, rows: 6 },
  output: { diagonal: 5, gridWidth: 15, gridHeight: 24 },
} satisfies ToolExample<Input, Output>;
export const drawingGridCellDiagonalReferenceTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "visual-arts/drawing-grid-cell-diagonal-reference",
    title: "Drawing Grid Cell Diagonal Reference Tool",
    description:
      "Calculate drawing grid cell diagonal reference from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        cellWidth: { type: "number", minimum: 0 },
        cellHeight: { type: "number", minimum: 0 },
        columns: { type: "integer", minimum: 0 },
        rows: { type: "integer", minimum: 0 },
      },
      required: ["cellWidth", "cellHeight", "columns", "rows"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        diagonal: { type: "number" },
        gridWidth: { type: "number" },
        gridHeight: { type: "number" },
      },
      required: ["diagonal", "gridWidth", "gridHeight"],
    },
    ports: {
      inputs: [
        {
          id: "cellWidth",
          label: "Cell Width",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "cellHeight",
          label: "Cell Height",
          required: true,
          valueType: { type: "number" },
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
        { id: "diagonal", label: "Diagonal", valueType: { type: "number" } },
        { id: "gridWidth", label: "Grid Width", valueType: { type: "number" } },
        {
          id: "gridHeight",
          label: "Grid Height",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = drawingGridCellDiagonalReferenceTool.execute;
export default drawingGridCellDiagonalReferenceTool;
