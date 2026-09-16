import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  intervals,
} from "../batch53-shared.js";

export type Input = Readonly<{
  intervals: readonly (readonly number[])[];
  minimumGap: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "intervals", label: "Intervals", kind: "matrix" },
  { id: "minimumGap", label: "Minimum gap", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (
  i: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  nonnegative(i.minimumGap, "gap");
  const a = intervals(i.intervals)
    .filter(([s, e]) => e > s)
    .sort((a, b) => a[0] - b[0]);
  const gaps: number[][] = [];
  let end = a[0]?.[1];
  for (let j = 1; j < a.length; j++) {
    if (a[j][0] > end! && a[j][0] - end! >= i.minimumGap)
      gaps.push([end!, a[j][0]]);
    end = Math.max(end!, a[j][1]);
  }
  return { selectedGaps: gaps };
};
export const calculate = (i: Input, context?: ToolExecutionContext): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i, context) });
};
export const example = {
  input: {
    intervals: [
      [0, 1],
      [3, 4],
      [3.5, 5],
    ],
    minimumGap: 2,
  },
  output: { result: { selectedGaps: [[1, 3]] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "interval/interval-gap-threshold-selector",
  title: "Interval Gap Threshold Selector",
  description:
    "Select positive uncovered gaps between union-covered intervals at an inclusive caller gap-length threshold.",
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
