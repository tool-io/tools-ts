import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, lines } from "../batch53-shared.js";

export type Input = Readonly<{ text: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "text", label: "Text", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (
  i: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  return {
    spans: lines(i.text).flatMap((r, j) => {
      const m = /[ \t]+$/.exec(r.text);
      return m ? [{ line: j + 1, start: r.start + m.index, end: r.end }] : [];
    }),
  };
};
export const calculate = (i: Input, context?: ToolExecutionContext): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i, context) });
};
export const example = {
  input: { text: "a \n b\t" },
  output: {
    result: {
      spans: [
        { line: 1, start: 1, end: 2 },
        { line: 2, start: 5, end: 6 },
      ],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "text/trailing-space-span-finder",
  title: "Trailing Space Span Finder",
  description:
    "Find half-open UTF-16 spans of trailing ASCII spaces/tabs without treating newline characters as spaces.",
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
