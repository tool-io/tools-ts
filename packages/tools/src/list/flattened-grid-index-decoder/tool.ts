import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, bounded } from "../batch53-shared.js";

export type Input = Readonly<{ index: number; rows: number; columns: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "index", label: "Index", kind: "number" },
  { id: "rows", label: "Rows", kind: "number" },
  { id: "columns", label: "Columns", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (
  i: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  bounded(i.rows, "rows", 1, 1e6);
  bounded(i.columns, "columns", 1, 1e6);
  bounded(i.index, "index", 0, i.rows * i.columns - 1);
  return { row: Math.floor(i.index / i.columns), column: i.index % i.columns };
};
export const calculate = (i: Input, context?: ToolExecutionContext): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i, context) });
};
export const example = {
  input: { index: 5, rows: 2, columns: 3 },
  output: { result: { row: 1, column: 2 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "list/flattened-grid-index-decoder",
  title: "Flattened Grid Index Decoder",
  description:
    "Decode a zero-based row-major flattened grid index with explicit dimensions.",
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
