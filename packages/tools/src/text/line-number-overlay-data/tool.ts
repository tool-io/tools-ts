import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, bounded, lines } from "../batch53-shared.js";

export type Input = Readonly<{ text: string; startNumber: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "text", label: "Text", kind: "string" },
  { id: "startNumber", label: "Start number", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (
  i: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  bounded(i.startNumber, "number", 0, 1e9);
  return {
    lines: lines(i.text).map((r, j) => ({
      number: i.startNumber + j,
      start: r.start,
      end: r.end,
      text: r.text,
    })),
  };
};
export const calculate = (i: Input, context?: ToolExecutionContext): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i, context) });
};
export const example = {
  input: { text: "a\nb", startNumber: 10 },
  output: {
    result: {
      lines: [
        { number: 10, start: 0, end: 1, text: "a" },
        { number: 11, start: 2, end: 3, text: "b" },
      ],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "text/line-number-overlay-data",
  title: "Line Number Overlay Data",
  description:
    "Build line-number overlay data without modifying source text; preserve UTF-16 source spans and an explicit starting label.",
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
