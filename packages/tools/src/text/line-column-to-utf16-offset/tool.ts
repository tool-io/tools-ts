import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, bounded, lines } from "../batch53-shared.js";

export type Input = Readonly<{ text: string; line: number; column: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "text", label: "Text", kind: "string" },
  { id: "line", label: "Line", kind: "number" },
  { id: "column", label: "Column", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (
  i: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  const a = lines(i.text);
  bounded(i.line, "line", 1, a.length);
  const r = a[i.line - 1];
  bounded(i.column, "column", 1, r.text.length + 1);
  return { offset: r.start + i.column - 1 };
};
export const calculate = (i: Input, context?: ToolExecutionContext): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i, context) });
};
export const example = {
  input: { text: "a\r\nb", line: 2, column: 1 },
  output: { result: { offset: 3 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "text/line-column-to-utf16-offset",
  title: "Line and Column to UTF-16 Offset",
  description:
    "Map one-based logical line/UTF-16 content column to offset; columns inside separators are intentionally not accepted.",
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
