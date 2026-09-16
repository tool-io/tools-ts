import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, span, lines } from "../batch53-shared.js";

export type Input = Readonly<{ text: string; start: number; end: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "text", label: "Text", kind: "string" },
  { id: "start", label: "Start", kind: "number" },
  { id: "end", label: "End", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (
  i: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  span(i.start, i.end, i.text.length);
  return {
    intersections: lines(i.text).flatMap((r, j) => {
      const start = Math.max(r.start, i.start),
        end = Math.min(r.end, i.end);
      return end > start ? [{ line: j + 1, start, end }] : [];
    }),
  };
};
export const calculate = (i: Input, context?: ToolExecutionContext): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i, context) });
};
export const example = {
  input: { text: "ab\ncd", start: 1, end: 4 },
  output: {
    result: {
      intersections: [
        { line: 1, start: 1, end: 2 },
        { line: 2, start: 3, end: 4 },
      ],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "text/line-span-intersection",
  title: "Line Span Intersection Tool",
  description:
    "Intersect a half-open UTF-16 selection with line-content spans; exclude separators and zero-length contacts.",
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
