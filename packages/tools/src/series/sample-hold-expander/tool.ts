import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  timeSamples,
} from "../batch53-shared.js";

export type Input = Readonly<{
  times: readonly number[];
  values: readonly number[];
  queryTimes: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "times", label: "Times", kind: "numberList" },
  { id: "values", label: "Values", kind: "numberList" },
  { id: "queryTimes", label: "Query times", kind: "numberList" },
] as const satisfies readonly SimpleField[];
const compute = (
  i: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  timeSamples(i.times, i.values);
  return {
    heldValues: i.queryTimes.map((q) => {
      if (q < i.times[0] || q > i.times.at(-1)!)
        simpleError("query", "No extrapolation.");
      let j = 0;
      while (j + 1 < i.times.length && i.times[j + 1] <= q) j++;
      return i.values[j];
    }),
  };
};
export const calculate = (i: Input, context?: ToolExecutionContext): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i, context) });
};
export const example = {
  input: { times: [0, 2], values: [1, 3], queryTimes: [0, 1, 2] },
  output: { result: { heldValues: [1, 1, 3] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "series/sample-hold-expander",
  title: "Sample Hold Expander",
  description:
    "Evaluate previous-sample hold at explicit query times within the sampled domain; exact sample timestamps use their new value.",
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
