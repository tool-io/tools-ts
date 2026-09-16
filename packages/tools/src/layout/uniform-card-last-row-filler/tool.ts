import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, bounded, mod } from "../batch53-shared.js";

export type Input = Readonly<{ itemCount: number; columns: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "itemCount", label: "Item count", kind: "number" },
  { id: "columns", label: "Columns", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (
  i: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  bounded(i.itemCount, "items", 0, 1e9);
  bounded(i.columns, "columns", 1, 1e9);
  return {
    fillerCount: i.itemCount === 0 ? 0 : mod(-i.itemCount, i.columns),
    lastRowItemCount:
      i.itemCount === 0 ? 0 : i.itemCount % i.columns || i.columns,
  };
};
export const calculate = (i: Input, context?: ToolExecutionContext): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i, context) });
};
export const example = {
  input: { itemCount: 8, columns: 3 },
  output: { result: { fillerCount: 1, lastRowItemCount: 2 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "layout/uniform-card-last-row-filler",
  title: "Uniform Card Last Row Filler",
  description:
    "Plan uniform-grid last-row filler count, with no filler row for zero items; does not generate DOM elements.",
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
