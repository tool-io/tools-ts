import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, bounded } from "../batch53-shared.js";

export type Input = Readonly<{
  row: number;
  column: number;
  rows: number;
  columns: number;
  tileRows: number;
  tileColumns: number;
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "row", label: "Row", kind: "number" },
  { id: "column", label: "Column", kind: "number" },
  { id: "rows", label: "Rows", kind: "number" },
  { id: "columns", label: "Columns", kind: "number" },
  { id: "tileRows", label: "Tile rows", kind: "number" },
  { id: "tileColumns", label: "Tile columns", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (i: Input, context?: ToolExecutionContext) => {
  bounded(i.rows, "rows", 1, 1e9);
  bounded(i.columns, "columns", 1, 1e9);
  bounded(i.row, "row", 0, i.rows - 1);
  bounded(i.column, "column", 0, i.columns - 1);
  bounded(i.tileRows, "tile-rows", 1, 1e9);
  bounded(i.tileColumns, "tile-columns", 1, 1e9);
  const tileColumnCount = Math.ceil(i.columns / i.tileColumns),
    index =
      Math.floor(i.row / i.tileRows) * tileColumnCount +
      Math.floor(i.column / i.tileColumns);
  bounded(index, "index", 0, Number.MAX_SAFE_INTEGER);
  return { tileIndex: index, tileColumnCount };
};
export const calculate = (i: Input, context?: ToolExecutionContext) => {
  validateInput(i, fields);
  return finish({ result: compute(i, context) });
};
export const example = {
  input: {
    row: 5,
    column: 7,
    rows: 6,
    columns: 8,
    tileRows: 2,
    tileColumns: 3,
  },
  output: { result: { tileIndex: 8, tileColumnCount: 3 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "grid/grid-tile-linear-address",
  title: "Grid Tile Linear Address",
  description:
    "Compute row-major tile index with edge tiles retained and explicit grid/tile dimensions; no padded cell address is inferred.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified evidence",
      kind: "object",

      schema: {
        type: "object",
        additionalProperties: false,
        properties: {
          tileIndex: { type: "number" },
          tileColumnCount: { type: "number" },
        },
        required: ["tileIndex", "tileColumnCount"],
      },
    },
  ],
  calculate: (v, context) => calculate(v as unknown as Input, context),
});
export const run = tool.execute;
export default tool;
