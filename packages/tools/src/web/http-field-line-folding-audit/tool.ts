import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, lines } from "../batch53-shared.js";

export type Input = Readonly<{ headerBlock: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "headerBlock", label: "Header block", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (
  i: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  const a = lines(i.headerBlock);
  return {
    foldedLineNumbers: a.flatMap((r, j) =>
      /^[ \t]/.test(r.text) ? [j + 1] : [],
    ),
    bareLfLineNumbers: a.flatMap((r, j) => (r.eol === "\n" ? [j + 1] : [])),
    bareCrLineNumbers: a.flatMap((r, j) => (r.eol === "\r" ? [j + 1] : [])),
  };
};
export const calculate = (i: Input, context?: ToolExecutionContext): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i, context) });
};
export const example = {
  input: { headerBlock: "X: a\r\n b\r\nY: c\n" },
  output: {
    result: {
      foldedLineNumbers: [2],
      bareLfLineNumbers: [3],
      bareCrLineNumbers: [],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "web/http-field-line-folding-audit",
  title: "HTTP Field Line Folding Audit",
  description:
    "Audit obsolete field folding and bare CR/LF in a supplied header block; does not normalize potentially ambiguous HTTP framing.",
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
