import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  aligned,
  mean,
} from "../batch40-shared.js";
export type Input = Readonly<{
  readonly observedBuildDays: readonly number[];
  readonly observedMeasureDays: readonly number[];
  readonly observedLearnDays: readonly number[];
}>;
export type Output = Readonly<{
  readonly cycleElapsedDays: readonly number[];
  readonly meanObservedCycleDays: number;
}>;
const inputFields = [
  { id: "observedBuildDays", label: "Observed build days", kind: "numberList" },
  {
    id: "observedMeasureDays",
    label: "Observed measure days",
    kind: "numberList",
  },
  { id: "observedLearnDays", label: "Observed learn days", kind: "numberList" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedBuildDays.forEach((v) => nonnegative(v, "observedBuildDays"));
  input.observedMeasureDays.forEach((v) =>
    nonnegative(v, "observedMeasureDays"),
  );
  input.observedLearnDays.forEach((v) => nonnegative(v, "observedLearnDays"));
  aligned(
    input.observedBuildDays,
    input.observedMeasureDays,
    "observedBuildDays",
  );
  aligned(
    input.observedBuildDays,
    input.observedLearnDays,
    "observedBuildDays",
  );
  const d = input.observedBuildDays.map(
    (v, i) => v + input.observedMeasureDays[i] + input.observedLearnDays[i],
  );
  return { cycleElapsedDays: d, meanObservedCycleDays: mean(d) };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedBuildDays: [2, 3],
  observedMeasureDays: [1, 2],
  observedLearnDays: [1, 1],
} satisfies Input;
export const exampleOutput = {
  cycleElapsedDays: [4, 6],
  meanObservedCycleDays: 5,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "entrepreneurship/build-measure-learn-cycle-time-tracker",
  title: "Build Measure Learn Cycle Time Tracker",
  description:
    "Actual disjoint sequential build/measure/learn stage durations per cycle, not sales cycle or time-to-first-value metric. Caller independently verifies policy, evidence, dates and applicability; not legal/compliance advice or causal business-success prediction.",
  inputs: inputFields,
  outputs: [
    { id: "cycleElapsedDays", label: "Cycle elapsed days", kind: "numberList" },
    {
      id: "meanObservedCycleDays",
      label: "Mean observed cycle days",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedBuildDays: value.observedBuildDays as readonly number[],
      observedMeasureDays: value.observedMeasureDays as readonly number[],
      observedLearnDays: value.observedLearnDays as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
