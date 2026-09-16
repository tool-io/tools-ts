import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, lines } from "../batch53-shared.js";

export type Input = Readonly<{ left: string; right: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "left", label: "Left", kind: "string" },
  { id: "right", label: "Right", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (
  i: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  const a = lines(i.left),
    b = lines(i.right);
  return {
    pairs: Array.from({ length: Math.max(a.length, b.length) }, (_, j) => ({
      line: j + 1,
      left: a[j]?.text ?? null,
      right: b[j]?.text ?? null,
    })),
  };
};
export const calculate = (i: Input, context?: ToolExecutionContext): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i, context) });
};
export const example = {
  input: { left: "a\nb", right: "c" },
  output: {
    result: {
      pairs: [
        { line: 1, left: "a", right: "c" },
        { line: 2, left: "b", right: null },
      ],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "text/line-pair-zipper",
  title: "Line Pair Zipper",
  description:
    "Zip hard-line content positionally; missing lines are null, not empty strings or dropped rows.",
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
