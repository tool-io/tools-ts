import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, bounded, lines } from "../batch53-shared.js";

export type Input = Readonly<{ text: string; maximumCodeUnits: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "text", label: "Text", kind: "string" },
  { id: "maximumCodeUnits", label: "Maximum code units", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (
  i: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  bounded(i.maximumCodeUnits, "maximum", 0, 8192);
  return {
    violations: lines(i.text).flatMap((r, j) =>
      r.text.length > i.maximumCodeUnits
        ? [
            {
              line: j + 1,
              length: r.text.length,
              excess: r.text.length - i.maximumCodeUnits,
            },
          ]
        : [],
    ),
  };
};
export const calculate = (i: Input, context?: ToolExecutionContext): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i, context) });
};
export const example = {
  input: { text: "abc\nx", maximumCodeUnits: 2 },
  output: { result: { violations: [{ line: 1, length: 3, excess: 1 }] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "text/line-length-limit-audit",
  title: "Line Length Limit Audit",
  description:
    "Audit UTF-16 hard-line content length against an inclusive caller limit; not grapheme or display-cell width.",
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
