import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, bounded, lines } from "../batch53-shared.js";

export type Input = Readonly<{ text: string; offset: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "text", label: "Text", kind: "string" },
  { id: "offset", label: "Offset", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (
  i: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  bounded(i.offset, "offset", 0, i.text.length);
  const a = lines(i.text);
  let j = a.reduce((last, r, j) => (r.start <= i.offset ? j : last), 0);
  return {
    line: j + 1,
    column: i.offset - a[j].start + 1,
    insideCrLf: a[j].eol === "\r\n" && i.offset === a[j].end + 1,
  };
};
export const calculate = (i: Input, context?: ToolExecutionContext): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i, context) });
};
export const example = {
  input: { text: "a\r\nb", offset: 3 },
  output: { result: { line: 2, column: 1, insideCrLf: false } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "text/utf16-offset-to-line-column",
  title: "UTF-16 Offset to Line and Column",
  description:
    "Map a UTF-16 offset to one-based line/column with CRLF treated as one line separator; offsets inside CRLF retain their physical column.",
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
