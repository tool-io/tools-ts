import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, bounded } from "../batch53-shared.js";

export type Input = Readonly<{ counts: readonly number[] }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "counts", label: "Counts", kind: "numberList" },
] as const satisfies readonly SimpleField[];
const compute = (
  i: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  i.counts.forEach((v) => bounded(v, "count", 0, 1e12));
  const starts = i.counts.length ? [0] : [];
  i.counts.forEach((v, j) => {
    if (j && v < i.counts[j - 1]) starts.push(j);
  });
  return {
    segments: starts.map((start, j) => ({
      start,
      end: starts[j + 1] ?? i.counts.length,
    })),
    resetIndexes: starts.slice(1),
  };
};
export const calculate = (i: Input, context?: ToolExecutionContext): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i, context) });
};
export const example = {
  input: { counts: [1, 2, 0, 3] },
  output: {
    result: {
      segments: [
        { start: 0, end: 2 },
        { start: 2, end: 4 },
      ],
      resetIndexes: [2],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "series/counter-reset-segmenter",
  title: "Counter Reset Segmenter",
  description:
    "Segment a nonnegative sampled counter at decreases interpreted as reset candidates; resets and wraps cannot be distinguished from values alone.",
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
