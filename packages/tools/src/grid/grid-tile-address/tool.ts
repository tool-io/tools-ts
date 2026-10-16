import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, bounded } from "../batch53-shared.js";

export type Input = Readonly<{
  row: number;
  column: number;
  tileRows: number;
  tileColumns: number;
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "row", label: "Row", kind: "number" },
  { id: "column", label: "Column", kind: "number" },
  { id: "tileRows", label: "Tile rows", kind: "number" },
  { id: "tileColumns", label: "Tile columns", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (i: Input, context?: ToolExecutionContext) => {
  bounded(i.row, "row", 0, 1e9);
  bounded(i.column, "column", 0, 1e9);
  bounded(i.tileRows, "tile-rows", 1, 1e9);
  bounded(i.tileColumns, "tile-columns", 1, 1e9);
  return {
    tileRow: Math.floor(i.row / i.tileRows),
    tileColumn: Math.floor(i.column / i.tileColumns),
    localRow: i.row % i.tileRows,
    localColumn: i.column % i.tileColumns,
  };
};
export const calculate = (i: Input, context?: ToolExecutionContext) => {
  validateInput(i, fields);
  return finish({ result: compute(i, context) });
};
export const example = {
  input: { row: 5, column: 7, tileRows: 2, tileColumns: 3 },
  output: {
    result: { tileRow: 2, tileColumn: 2, localRow: 1, localColumn: 1 },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "grid/grid-tile-address",
  title: "Grid Tile Address",
  description:
    "Decode zero-based grid coordinates into rectangular tile coordinates and local offsets; no bounds or storage order is inferred.",
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
          tileRow: { type: "number" },
          tileColumn: { type: "number" },
          localRow: { type: "number" },
          localColumn: { type: "number" },
        },
        required: ["tileRow", "tileColumn", "localRow", "localColumn"],
      },
    },
  ],
  calculate: (v, context) => calculate(v as unknown as Input, context),
});
export const run = tool.execute;
export default tool;
