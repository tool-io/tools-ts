import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish } from "../batch53-shared.js";

export type Input = Readonly<{ values: readonly number[] }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "values", label: "Values", kind: "numberList" },
] as const satisfies readonly SimpleField[];
const compute = (
  i: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  const out: { start: number; end: number }[] = [];
  let start = 0;
  for (let j = 1; j <= i.values.length; j++)
    if (
      j === i.values.length ||
      i.values[j] === 0 ||
      i.values[j - 1] === 0 ||
      Math.sign(i.values[j]) === Math.sign(i.values[j - 1])
    ) {
      if (j > start) out.push({ start, end: j });
      start = j;
    }
  return { segments: out };
};
export const calculate = (i: Input, context?: ToolExecutionContext): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i, context) });
};
export const example = {
  input: { values: [1, -1, 1, 2, -2] },
  output: {
    result: {
      segments: [
        { start: 0, end: 3 },
        { start: 3, end: 5 },
      ],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "list/alternating-sign-run-segmenter",
  title: "Alternating Sign Run Segmenter",
  description:
    "Segment consecutive strictly alternating nonzero signs; zeros and equal adjacent signs break runs.",
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
