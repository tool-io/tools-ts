import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, mean, timeSamples } from "../batch53-shared.js";

export type Input = Readonly<{
  times: readonly number[];
  values: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "times", label: "Times", kind: "numberList" },
  { id: "values", label: "Values", kind: "numberList" },
] as const satisfies readonly SimpleField[];
const compute = (
  i: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  timeSamples(i.times, i.values, 2);
  let integral = 0;
  for (let j = 0; j < i.times.length - 1; j++)
    integral += i.values[j] * (i.times[j + 1] - i.times[j]);
  const duration = i.times.at(-1)! - i.times[0];
  return { integral, duration, mean: integral / duration };
};
export const calculate = (i: Input, context?: ToolExecutionContext): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i, context) });
};
export const example = {
  input: { times: [0, 1, 3], values: [2, 4, 99] },
  output: { result: { integral: 10, duration: 3, mean: 3.3333333333333335 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "series/time-weighted-step-mean",
  title: "Time Weighted Step Mean",
  description:
    "Integrate previous-sample hold over the observed time domain and divide by duration; not an arithmetic sample mean.",
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
