import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  bounded,
  mean,
  strictlyIncreasing,
} from "../batch33-shared.js";
export type Input = Readonly<{
  readonly observedFouetteCountStartTimesSeconds: readonly number[];
  readonly callerTargetCount: number;
}>;
export type Output = Readonly<{
  readonly observedCountIntervalMeanSeconds: number;
  readonly projectedFouetteCountDurationSeconds: number;
  readonly observedIntervalRangeSeconds: readonly number[];
}>;
const inputFields = [
  {
    id: "observedFouetteCountStartTimesSeconds",
    label: "Observed fouette count start times seconds",
    kind: "numberList",
  },
  { id: "callerTargetCount", label: "Caller target count", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  strictlyIncreasing(input.observedFouetteCountStartTimesSeconds, "counts");
  bounded(input.callerTargetCount, "target", 1, 128);
  const gaps = input.observedFouetteCountStartTimesSeconds
      .slice(1)
      .map((v, i) => v - input.observedFouetteCountStartTimesSeconds[i]),
    average = mean(gaps);
  return {
    observedCountIntervalMeanSeconds: average,
    projectedFouetteCountDurationSeconds: average * input.callerTargetCount,
    observedIntervalRangeSeconds: [Math.min(...gaps), Math.max(...gaps)],
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedFouetteCountStartTimesSeconds: [0, 1, 3],
  callerTargetCount: 32,
} satisfies Input;
export const exampleOutput = {
  observedCountIntervalMeanSeconds: 1.5,
  projectedFouetteCountDurationSeconds: 48,
  observedIntervalRangeSeconds: [1, 2],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "dance/fouette-turns-32-count-duration-seconds",
  title: "Fouette Turns 32 Count Duration Seconds",
  description:
    "Estimate actual fouette set duration from measured count intervals with observed variation; assumes representative intervals, not literal BPM-to-seconds conversion or count-equals-turn/32-turn readiness.",
  inputs: inputFields,
  outputs: [
    {
      id: "observedCountIntervalMeanSeconds",
      label: "Observed count interval mean seconds",
      kind: "number",
    },
    {
      id: "projectedFouetteCountDurationSeconds",
      label: "Projected fouette count duration seconds",
      kind: "number",
    },
    {
      id: "observedIntervalRangeSeconds",
      label: "Observed interval range seconds",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      observedFouetteCountStartTimesSeconds:
        value.observedFouetteCountStartTimesSeconds as readonly number[],
      callerTargetCount: value.callerTargetCount as number,
    }),
});
export const run = tool.execute;
export default tool;
