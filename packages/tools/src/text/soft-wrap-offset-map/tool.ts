import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, bounded, lines } from "../batch53-shared.js";

export type Input = Readonly<{ text: string; width: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "text", label: "Text", kind: "string" },
  { id: "width", label: "Width", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (
  i: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  bounded(i.width, "width", 1, 8192);
  return {
    segments: lines(i.text).flatMap((r, j) => {
      const a: { line: number; start: number; end: number }[] = [];
      if (!r.text.length) a.push({ line: j + 1, start: r.start, end: r.start });
      for (let k = 0; k < r.text.length; k += i.width)
        a.push({
          line: j + 1,
          start: r.start + k,
          end: Math.min(r.end, r.start + k + i.width),
        });
      return a;
    }),
  };
};
export const calculate = (i: Input, context?: ToolExecutionContext): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i, context) });
};
export const example = {
  input: { text: "abcde", width: 2 },
  output: {
    result: {
      segments: [
        { line: 1, start: 0, end: 2 },
        { line: 1, start: 2, end: 4 },
        { line: 1, start: 4, end: 5 },
      ],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "text/soft-wrap-offset-map",
  title: "Soft Wrap Offset Map",
  description:
    "Map fixed-width soft-wrap segments in UTF-16 code units per hard line; not word wrapping, grapheme layout or display-cell measurement.",
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
