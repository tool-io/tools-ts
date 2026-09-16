import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, bounded } from "../batch53-shared.js";

export type Input = Readonly<{
  rows: number;
  columns: number;
  row: number;
  column: number;
  elementBytes: number;
  baseOffset: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "rows", label: "Rows", kind: "number" },
  { id: "columns", label: "Columns", kind: "number" },
  { id: "row", label: "Row", kind: "number" },
  { id: "column", label: "Column", kind: "number" },
  { id: "elementBytes", label: "Element bytes", kind: "number" },
  { id: "baseOffset", label: "Base offset", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (
  i: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  bounded(i.rows, "rows", 1, 1e6);
  bounded(i.columns, "columns", 1, 1e6);
  bounded(i.row, "row", 0, i.rows - 1);
  bounded(i.column, "column", 0, i.columns - 1);
  bounded(i.elementBytes, "bytes", 1, 10000);
  bounded(i.baseOffset, "base", 0, 1e12);
  const byteOffset =
    i.baseOffset + (i.row * i.columns + i.column) * i.elementBytes;
  bounded(byteOffset, "offset", 0, Number.MAX_SAFE_INTEGER);
  return { byteOffset };
};
export const calculate = (i: Input, context?: ToolExecutionContext): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i, context) });
};
export const example = {
  input: {
    rows: 2,
    columns: 3,
    row: 1,
    column: 2,
    elementBytes: 4,
    baseOffset: 0,
  },
  output: { result: { byteOffset: 20 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "grid/row-major-stride-offset",
  title: "Row Major Stride Offset",
  description:
    "Compute a contiguous row-major byte offset with explicit element size and base address; no memory access or inferred padding.",
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
