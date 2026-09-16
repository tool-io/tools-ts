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
  let durationAbove = 0;
  for (let j = 0; j < i.times.length - 1; j++)
    if (i.values[j] >= i.threshold)
      durationAbove += i.times[j + 1] - i.times[j];
  const observedDuration = i.times.at(-1)! - i.times[0];
  return {
    durationAtOrAbove: durationAbove,
    fractionAtOrAbove: durationAbove / observedDuration,
    model: "left-continuous-sample-hold",
  };
};
export const calculate = (i: Input, context?: ToolExecutionContext): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i, context) });
};
export const example = {
  input: { times: [0, 1, 3], values: [2, 0, 2], threshold: 1 },
  output: {
    result: {
      durationAtOrAbove: 1,
      fractionAtOrAbove: 0.3333333333333333,
      model: "left-continuous-sample-hold",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "series/threshold-time-occupancy",
  title: "Threshold Time Occupancy",
  description:
    "Measure threshold occupancy over the observed time domain under previous-sample hold; the last sample has zero following duration.",
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
