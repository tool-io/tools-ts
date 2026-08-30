import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  aligned,
  binary,
  sum,
  ratioWeighted,
} from "../shared.js";
export type Input = Readonly<{
  readonly observedDwellMinutes: readonly number[];
  readonly completeObservationFlags: readonly number[];
  readonly representedVisitorWeights: readonly number[];
}>;
export type Output = Readonly<{
  readonly weightedCompletedDwellMinutes: number;
  readonly completedObservationCount: number;
  readonly censoredObservationCount: number;
  readonly weightedAllObservedMinimumDwellMinutes: number;
}>;
const inputFields = [
  {
    id: "observedDwellMinutes",
    label: "Observed dwell minutes",
    kind: "numberList",
  },
  {
    id: "completeObservationFlags",
    label: "Complete observation flags",
    kind: "numberList",
  },
  {
    id: "representedVisitorWeights",
    label: "Represented visitor weights",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.representedVisitorWeights.forEach((v) =>
    positive(v, "representedVisitorWeights"),
  );
  input.observedDwellMinutes.forEach((v) =>
    nonnegative(v, "observedDwellMinutes"),
  );
  aligned(
    input.observedDwellMinutes,
    input.completeObservationFlags,
    "observedDwellMinutes",
  );
  aligned(
    input.observedDwellMinutes,
    input.representedVisitorWeights,
    "observedDwellMinutes",
  );
  binary(input.completeObservationFlags, "complete");
  const w = input.representedVisitorWeights.map(
    (v, i) => v * input.completeObservationFlags[i],
  );
  return {
    weightedCompletedDwellMinutes: ratioWeighted(input.observedDwellMinutes, w),
    completedObservationCount: sum(input.completeObservationFlags),
    censoredObservationCount:
      input.completeObservationFlags.length -
      sum(input.completeObservationFlags),
    weightedAllObservedMinimumDwellMinutes: ratioWeighted(
      input.observedDwellMinutes,
      input.representedVisitorWeights,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedDwellMinutes: [2, 10, 20],
  completeObservationFlags: [1, 1, 0],
  representedVisitorWeights: [1, 3, 1],
} satisfies Input;
export const exampleOutput = {
  weightedCompletedDwellMinutes: 8,
  completedObservationCount: 2,
  censoredObservationCount: 1,
  weightedAllObservedMinimumDwellMinutes: 10.4,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "museology/dwell-time-average-aggregator",
  title: "Exhibit Dwell Time Average Minutes Aggregator",
  description:
    "Aggregate complete dwell measurements separately from censored observed lower bounds under represented visitor weights; not survival-corrected mean dwell or ignoring unfinished visits.",
  inputs: inputFields,
  outputs: [
    {
      id: "weightedCompletedDwellMinutes",
      label: "Weighted completed dwell minutes",
      kind: "number",
    },
    {
      id: "completedObservationCount",
      label: "Completed observation count",
      kind: "number",
    },
    {
      id: "censoredObservationCount",
      label: "Censored observation count",
      kind: "number",
    },
    {
      id: "weightedAllObservedMinimumDwellMinutes",
      label: "Weighted all observed minimum dwell minutes",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedDwellMinutes: value.observedDwellMinutes as readonly number[],
      completeObservationFlags:
        value.completeObservationFlags as readonly number[],
      representedVisitorWeights:
        value.representedVisitorWeights as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
