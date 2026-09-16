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
  if (!i.values.length) return { segments: [] };
  const segments: { start: number; end: number; direction: number }[] = [];
  let start = 0,
    dir = 0;
  for (let j = 1; j < i.values.length; j++) {
    const d = Math.sign(i.values[j] - i.values[j - 1]);
    if (d !== 0 && dir !== 0 && d !== dir) {
      segments.push({ start, end: j, direction: dir });
      start = j - 1;
    }
    if (d) dir = d;
  }
  segments.push({ start, end: i.values.length, direction: dir });
  return { segments };
};
export const calculate = (i: Input, context?: ToolExecutionContext): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i, context) });
};
export const example = {
  input: { values: [1, 2, 3, 2] },
  output: {
    result: {
      segments: [
        { start: 0, end: 3, direction: 1 },
        { start: 2, end: 4, direction: -1 },
      ],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "list/monotonic-run-segmenter",
  title: "Monotonic Run Segmenter",
  description:
    "Segment maximal weak-monotonic runs, sharing turning-point samples; flat steps retain the active direction and fully flat runs have direction zero.",
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
