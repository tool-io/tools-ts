import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, positive, count, mean } from "../shared.js";
export type Input = Readonly<{
  readonly stateLabels: readonly number[];
  readonly sampleRateHz: number;
  readonly targetState: number;
}>;
export type Output = Readonly<{
  readonly targetRunDurationsMs: readonly number[];
  readonly meanTargetDurationMs: number;
  readonly targetCoverageFraction: number;
}>;
const inputFields = [
  { id: "stateLabels", label: "State labels", kind: "numberList" },
  { id: "sampleRateHz", label: "Sample rate hz", kind: "number" },
  { id: "targetState", label: "Target state", kind: "integer" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  if (!input.stateLabels.length)
    simpleError(
      "stateLabels",
      "Nonempty contiguous microstate labels required.",
    );
  input.stateLabels.forEach((v) => count(v, "stateLabels"));
  count(input.targetState, "targetState");
  positive(input.sampleRateHz, "sampleRateHz");
  const targetRunDurationsMs: number[] = [];
  let run = 0,
    targetSamples = 0;
  for (let i = 0; i <= input.stateLabels.length; i++) {
    if (
      i < input.stateLabels.length &&
      input.stateLabels[i] === input.targetState
    ) {
      run++;
      targetSamples++;
    } else if (run) {
      targetRunDurationsMs.push((run / input.sampleRateHz) * 1000);
      run = 0;
    }
  }
  return {
    targetRunDurationsMs,
    meanTargetDurationMs: targetRunDurationsMs.length
      ? mean(targetRunDurationsMs)
      : 0,
    targetCoverageFraction: targetSamples / input.stateLabels.length,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  stateLabels: [1, 1, 2, 2, 2, 1],
  sampleRateHz: 100,
  targetState: 1,
} satisfies Input;
export const exampleOutput = {
  targetRunDurationsMs: [20, 10],
  meanTargetDurationMs: 15,
  targetCoverageFraction: 0.5,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "neuroscience/eeg-microstate-run-durations",
  title: "EEG Microstate Duration",
  description:
    "Measure target-state contiguous EEG label run durations and sample coverage; recording-edge partial runs are included and absence gives empty durations with zero coverage.",
  inputs: inputFields,
  outputs: [
    {
      id: "targetRunDurationsMs",
      label: "Target run durations ms",
      kind: "numberList",
    },
    {
      id: "meanTargetDurationMs",
      label: "Mean target duration ms",
      kind: "number",
    },
    {
      id: "targetCoverageFraction",
      label: "Target coverage fraction",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      stateLabels: value.stateLabels as readonly number[],
      sampleRateHz: value.sampleRateHz as number,
      targetState: value.targetState as number,
    }),
});
export const run = tool.execute;
export default tool;
