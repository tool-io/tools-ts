import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish } from "../batch53-shared.js";

export type Input = Readonly<{ text: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "text", label: "Text", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (
  i: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  const a = [...i.text.matchAll(/\S+/g)];
  return {
    gaps: a.slice(1).map((m, j) => {
      const start = a[j].index! + a[j][0].length,
        end = m.index!;
      return {
        start,
        end,
        length: end - start,
        text: i.text.slice(start, end),
      };
    }),
  };
};
export const calculate = (i: Input, context?: ToolExecutionContext): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i, context) });
};
export const example = {
  input: { text: "a  b\tc" },
  output: {
    result: {
      gaps: [
        { start: 1, end: 3, length: 2, text: "  " },
        { start: 4, end: 5, length: 1, text: "\t" },
      ],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "text/word-gap-length-table",
  title: "Word Gap Length Table",
  description:
    "Tabulate whitespace gaps between non-whitespace runs, excluding leading/trailing whitespace; positions and lengths use UTF-16 units.",
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
