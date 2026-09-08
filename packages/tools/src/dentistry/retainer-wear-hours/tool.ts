import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  aligned,
  sum,
} from "../batch47-shared.js";
export type Input = Readonly<{
  readonly actualRetainerWearIntervalStartsHours: readonly number[];
  readonly actualRetainerWearIntervalEndsHours: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualRetainerWearIntervalStartsHours",
    label: "Actual retainer wear interval starts hours",
    kind: "numberList",
  },
  {
    id: "actualRetainerWearIntervalEndsHours",
    label: "Actual retainer wear interval ends hours",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  aligned(
    input.actualRetainerWearIntervalStartsHours,
    input.actualRetainerWearIntervalEndsHours,
    "intervals",
  );
  const intervals = input.actualRetainerWearIntervalStartsHours
    .map((a, i) => {
      const b = input.actualRetainerWearIntervalEndsHours[i];
      if (a < 0 || b > 24 || b < a)
        simpleError(
          "interval",
          "Actual within-day ordered0–24 hour intervals.",
        );
      return [a, b];
    })
    .sort((a, b) => a[0] - b[0]);
  const t = sum(intervals.map(([a, b]) => b - a));
  let u = 0,
    last = -1;
  for (const [a, b] of intervals) {
    u += Math.max(0, b - Math.max(a, last));
    last = Math.max(last, b);
  }
  return { observedUnionWearHours: u, observedWearIntervalOverlapHours: t - u };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualRetainerWearIntervalStartsHours: [0, 12],
    actualRetainerWearIntervalEndsHours: [8, 16],
  },
  output: {
    result: { observedUnionWearHours: 12, observedWearIntervalOverlapHours: 0 },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "dentistry/retainer-wear-hours",
  title: "Retainer Wear Hours Calculator",
  description:
    "Actual24-hour retainer wear interval union, retaining overlap without double count. Not prescribe wear duration, certify adherence or guarantee orthodontic stability.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Qualified observation, conditional calculation or reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
