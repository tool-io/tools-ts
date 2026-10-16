import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, bounded } from "../batch53-shared.js";

export type Input = Readonly<{
  rows: number;
  columns: number;
  diagonalOffset: number;
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "rows", label: "Rows", kind: "number" },
  { id: "columns", label: "Columns", kind: "number" },
  { id: "diagonalOffset", label: "Diagonal offset", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (i: Input, context?: ToolExecutionContext) => {
  bounded(i.rows, "rows", 1, 128);
  bounded(i.columns, "columns", 1, 128);
  bounded(i.diagonalOffset, "offset", -128, 128);
  return {
    coordinates: Array.from({ length: i.rows }, (_, row) => [
      row,
      row + i.diagonalOffset,
    ]).filter(([, c]) => c >= 0 && c < i.columns),
  };
};
export const calculate = (i: Input, context?: ToolExecutionContext) => {
  validateInput(i, fields);
  return finish({ result: compute(i, context) });
};
export const example = {
  input: { rows: 3, columns: 3, diagonalOffset: 1 },
  output: {
    result: {
      coordinates: [
        [0, 1],
        [1, 2],
      ],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "grid/grid-diagonal-coordinate-list",
  title: "Grid Diagonal Coordinate List",
  description:
    "List coordinates on the grid diagonal column−row=offset in ascending row order; no square-grid assumption.",
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
          coordinates: {
            type: "array",
            items: { type: "array", items: { type: "number" } },
          },
        },
        required: ["coordinates"],
      },
    },
  ],
  calculate: (v, context) => calculate(v as unknown as Input, context),
});
export const run = tool.execute;
export default tool;
