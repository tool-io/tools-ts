import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, bounded } from "../batch53-shared.js";

export type Input = Readonly<{
  row: number;
  column: number;
  rows: number;
  columns: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "row", label: "Row", kind: "number" },
  { id: "column", label: "Column", kind: "number" },
  { id: "rows", label: "Rows", kind: "number" },
  { id: "columns", label: "Columns", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (
  i: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  bounded(i.rows, "rows", 1, 1e6);
  bounded(i.columns, "columns", 1, 1e6);
  bounded(i.row, "row", 0, i.rows - 1);
  bounded(i.column, "column", 0, i.columns - 1);
  return { index: i.row * i.columns + i.column };
};
export const calculate = (i: Input, context?: ToolExecutionContext): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i, context) });
};
export const example = {
  input: { row: 1, column: 2, rows: 2, columns: 3 },
  output: { result: { index: 5 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "list/grid-coordinate-linear-index",
  title: "Grid Coordinate Linear Index",
  description:
    "Encode zero-based rectangular grid coordinates to a row-major list index.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified evidence",
      kind: "object",
    },
  ],
  calculate: (v, context) => calculate(v as unknown as Input, context),
});
export const run = tool.execute;
export default tool;
