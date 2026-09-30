import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly row: number;
  readonly column: number;
  readonly blockRows: number;
  readonly blockColumns: number;
};
export type Output = {
  readonly blockRow: number;
  readonly blockColumn: number;
  readonly localRow: number;
  readonly localColumn: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    row: { type: "integer", minimum: 0 },
    column: { type: "integer", minimum: 0 },
    blockRows: { type: "integer", minimum: 1 },
    blockColumns: { type: "integer", minimum: 1 },
  },
  required: ["row", "column", "blockRows", "blockColumns"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    blockRow: { type: "integer" },
    blockColumn: { type: "integer" },
    localRow: { type: "integer" },
    localColumn: { type: "integer" },
  },
  required: ["blockRow", "blockColumn", "localRow", "localColumn"],
} as const;
/** Calculate matrix block transpose coordinate map from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { row, column, blockRows, blockColumns } = input;
  const compute = (): Output => {
    H.integer(row, 0);
    H.integer(column, 0);
    H.integer(blockRows, 1);
    H.integer(blockColumns, 1);
    return {
      blockRow: Math.floor(column / blockColumns),
      blockColumn: Math.floor(row / blockRows),
      localRow: column % blockColumns,
      localColumn: row % blockRows,
    };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { row: 5, column: 7, blockRows: 2, blockColumns: 3 },
  output: { blockRow: 2, blockColumn: 2, localRow: 1, localColumn: 1 },
} satisfies ToolExample<Input, Output>;
export const matrixBlockTransposeCoordinateMapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "matrix/matrix-block-transpose-coordinate-map",
    title: "Matrix Block Transpose Coordinate Map Tool",
    description:
      "Calculate matrix block transpose coordinate map from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        row: { type: "integer", minimum: 0 },
        column: { type: "integer", minimum: 0 },
        blockRows: { type: "integer", minimum: 1 },
        blockColumns: { type: "integer", minimum: 1 },
      },
      required: ["row", "column", "blockRows", "blockColumns"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        blockRow: { type: "integer" },
        blockColumn: { type: "integer" },
        localRow: { type: "integer" },
        localColumn: { type: "integer" },
      },
      required: ["blockRow", "blockColumn", "localRow", "localColumn"],
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
          id: "blockRows",
          label: "Block Rows",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "blockColumns",
          label: "Block Columns",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "blockRow", label: "Block Row", valueType: { type: "integer" } },
        {
          id: "blockColumn",
          label: "Block Column",
          valueType: { type: "integer" },
        },
        { id: "localRow", label: "Local Row", valueType: { type: "integer" } },
        {
          id: "localColumn",
          label: "Local Column",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = matrixBlockTransposeCoordinateMapTool.execute;
export default matrixBlockTransposeCoordinateMapTool;
