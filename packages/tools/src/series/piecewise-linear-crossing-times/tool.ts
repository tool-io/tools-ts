import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, timeSamples } from "../batch53-shared.js";

export type Input = Readonly<{
  times: readonly number[];
  values: readonly number[];
  threshold: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "times", label: "Times", kind: "numberList" },
  { id: "values", label: "Values", kind: "numberList" },
  { id: "threshold", label: "Threshold", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (
  i: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  timeSamples(i.times, i.values, 2);
  const times: number[] = [],
    plateaus: number[][] = [];
  for (let j = 0; j < i.times.length - 1; j++) {
    const a = i.values[j],
      b = i.values[j + 1];
    if (a === i.threshold && b === i.threshold) {
      plateaus.push([i.times[j], i.times[j + 1]]);
      continue;
    }
    if (
      a !== b &&
      i.threshold >= Math.min(a, b) &&
      i.threshold <= Math.max(a, b)
    )
      times.push(
        i.times[j] +
          ((i.threshold - a) / (b - a)) * (i.times[j + 1] - i.times[j]),
      );
  }
  return {
    crossingTimes: [...new Set(times)],
    thresholdPlateauIntervals: plateaus,
  };
};
export const calculate = (i: Input, context?: ToolExecutionContext): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i, context) });
};
export const example = {
  input: { times: [0, 2], values: [0, 4], threshold: 2 },
  output: { result: { crossingTimes: [1], thresholdPlateauIntervals: [] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "series/piecewise-linear-crossing-times",
  title: "Piecewise Linear Crossing Times",
  description:
    "Find piecewise-linear threshold crossing times and explicit threshold plateaus; shared endpoint times are deduplicated.",
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
