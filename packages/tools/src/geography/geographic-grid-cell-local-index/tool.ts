import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly column: number;
  readonly row: number;
  readonly columnsPerTile: number;
  readonly rowsPerTile: number;
};
export type Output = {
  readonly tileColumn: number;
  readonly tileRow: number;
  readonly localColumn: number;
  readonly localRow: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    column: { type: "integer" },
    row: { type: "integer" },
    columnsPerTile: { type: "integer", minimum: 1 },
    rowsPerTile: { type: "integer", minimum: 1 },
  },
  required: ["column", "row", "columnsPerTile", "rowsPerTile"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    tileColumn: { type: "integer" },
    tileRow: { type: "integer" },
    localColumn: { type: "integer" },
    localRow: { type: "integer" },
  },
  required: ["tileColumn", "tileRow", "localColumn", "localRow"],
} as const;
/** Calculate geographic grid cell local index from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { column, row, columnsPerTile, rowsPerTile } = input;
  const compute = (): Output => {
    H.integer(columnsPerTile, 1);
    H.integer(rowsPerTile, 1);
    return {
      tileColumn: Math.floor(column / columnsPerTile),
      tileRow: Math.floor(row / rowsPerTile),
      localColumn: H.mod(column, columnsPerTile),
      localRow: H.mod(row, rowsPerTile),
    };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { column: -1, row: 9, columnsPerTile: 4, rowsPerTile: 4 },
  output: { tileColumn: -1, tileRow: 2, localColumn: 3, localRow: 1 },
} satisfies ToolExample<Input, Output>;
export const geographicGridCellLocalIndexTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "geography/geographic-grid-cell-local-index",
    title: "Geographic Grid Cell Local Index Tool",
    description:
      "Calculate geographic grid cell local index from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        column: { type: "integer" },
        row: { type: "integer" },
        columnsPerTile: { type: "integer", minimum: 1 },
        rowsPerTile: { type: "integer", minimum: 1 },
      },
      required: ["column", "row", "columnsPerTile", "rowsPerTile"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        tileColumn: { type: "integer" },
        tileRow: { type: "integer" },
        localColumn: { type: "integer" },
        localRow: { type: "integer" },
      },
      required: ["tileColumn", "tileRow", "localColumn", "localRow"],
    },
    ports: {
      inputs: [
        {
          id: "column",
          label: "Column",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "row",
          label: "Row",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "columnsPerTile",
          label: "Columns Per Tile",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "rowsPerTile",
          label: "Rows Per Tile",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "tileColumn",
          label: "Tile Column",
          valueType: { type: "integer" },
        },
        { id: "tileRow", label: "Tile Row", valueType: { type: "integer" } },
        {
          id: "localColumn",
          label: "Local Column",
          valueType: { type: "integer" },
        },
        { id: "localRow", label: "Local Row", valueType: { type: "integer" } },
      ],
    },
  },
  calculate,
});
export const run = geographicGridCellLocalIndexTool.execute;
export default geographicGridCellLocalIndexTool;
