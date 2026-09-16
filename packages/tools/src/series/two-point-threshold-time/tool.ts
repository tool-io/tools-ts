import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, orderedPair } from "../batch53-shared.js";

export type Input = Readonly<{
  firstTime: number;
  secondTime: number;
  firstValue: number;
  secondValue: number;
  threshold: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "firstTime", label: "First time", kind: "number" },
  { id: "secondTime", label: "Second time", kind: "number" },
  { id: "firstValue", label: "First value", kind: "number" },
  { id: "secondValue", label: "Second value", kind: "number" },
  { id: "threshold", label: "Threshold", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (
  i: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  orderedPair(i.firstTime, i.secondTime, true);
  if (i.firstValue === i.secondValue)
    return {
      crossingTime: null,
      condition:
        i.firstValue === i.threshold ? "entire-plateau" : "no-crossing",
    };
  if (
    i.threshold < Math.min(i.firstValue, i.secondValue) ||
    i.threshold > Math.max(i.firstValue, i.secondValue)
  )
    return { crossingTime: null, condition: "outside-segment" };
  return {
    crossingTime:
      i.firstTime +
      ((i.threshold - i.firstValue) / (i.secondValue - i.firstValue)) *
        (i.secondTime - i.firstTime),
    condition: "one-linear-crossing",
  };
};
export const calculate = (i: Input, context?: ToolExecutionContext): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i, context) });
};
export const example = {
  input: {
    firstTime: 0,
    secondTime: 2,
    firstValue: 0,
    secondValue: 4,
    threshold: 2,
  },
  output: { result: { crossingTime: 1, condition: "one-linear-crossing" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "series/two-point-threshold-time",
  title: "Two Point Threshold Time",
  description:
    "Resolve the threshold time on one linear segment; retain flat threshold plateaus and out-of-range thresholds as distinct conditions.",
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
