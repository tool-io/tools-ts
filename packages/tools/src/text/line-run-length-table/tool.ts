import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, lines, runs } from "../batch53-shared.js";

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
    runs: runs(lines(i.text).map((r) => r.text)).map((r) => ({
      firstLine: r.start + 1,
      lastLine: r.end,
      count: r.end - r.start,
      text: r.value,
    })),
  };
};
export const calculate = (i: Input, context?: ToolExecutionContext): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i, context) });
};
export const example = {
  input: { text: "a\na\nb" },
  output: {
    result: {
      runs: [
        { firstLine: 1, lastLine: 2, count: 2, text: "a" },
        { firstLine: 3, lastLine: 3, count: 1, text: "b" },
      ],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "text/line-run-length-table",
  title: "Line Run Length Table",
  description:
    "Tabulate consecutive equal hard-line content runs with inclusive one-based line bounds.",
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
