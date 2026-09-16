import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, lines } from "../batch53-shared.js";

export type Input = Readonly<{ text: string; affix: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "text", label: "Text", kind: "string" },
  { id: "affix", label: "Affix", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (
  i: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  return {
    lines: lines(i.text).flatMap((r, j) =>
      r.text.startsWith(i.affix)
        ? [{ line: j + 1, text: r.text, start: r.start }]
        : [],
    ),
  };
};
export const calculate = (i: Input, context?: ToolExecutionContext): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i, context) });
};
export const example = {
  input: { text: "ax\nbx\nc", affix: "a" },
  output: { result: { lines: [{ line: 1, text: "ax", start: 0 }] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "text/line-prefix-filter",
  title: "Literal Line Prefix Filter",
  description:
    "Filter hard-line contents by an exact literal prefix; preserve source line numbers and offsets, without regex interpretation.",
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
