import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, runs } from "../batch53-shared.js";

export type Input = Readonly<{
  values: readonly number[];
  threshold: number;
  atOrAbove: boolean;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "values", label: "Values", kind: "numberList" },
  { id: "threshold", label: "Threshold", kind: "number" },
  { id: "atOrAbove", label: "At or above", kind: "boolean" },
] as const satisfies readonly SimpleField[];
const compute = (
  i: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  const a = i.values.map((v) =>
    i.atOrAbove ? v >= i.threshold : v < i.threshold,
  );
  return {
    streaks: runs(a)
      .filter((r) => r.value)
      .map((r) => ({ start: r.start, end: r.end, count: r.end - r.start })),
  };
};
export const calculate = (i: Input, context?: ToolExecutionContext): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i, context) });
};
export const example = {
  input: { values: [0, 2, 2, 0, 3], threshold: 2, atOrAbove: true },
  output: {
    result: {
      streaks: [
        { start: 1, end: 3, count: 2 },
        { start: 4, end: 5, count: 1 },
      ],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "series/consecutive-threshold-streaks",
  title: "Consecutive Threshold Streaks",
  description:
    "Tabulate sampled consecutive threshold streaks with explicit at-or-above versus strictly-below convention; no between-sample duration inference.",
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
