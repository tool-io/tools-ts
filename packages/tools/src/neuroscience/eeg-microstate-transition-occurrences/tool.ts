import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, positive, count } from "../shared.js";
export type Input = Readonly<{
  readonly stateLabels: readonly number[];
  readonly sampleRateHz: number;
  readonly targetState: number;
}>;
export type Output = Readonly<{
  readonly targetEntryCount: number;
  readonly entriesPerSecond: number;
  readonly recordingSeconds: number;
}>;
const inputFields = [
  { id: "stateLabels", label: "State labels", kind: "numberList" },
  { id: "sampleRateHz", label: "Sample rate hz", kind: "number" },
  { id: "targetState", label: "Target state", kind: "integer" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  if (!input.stateLabels.length)
    simpleError("stateLabels", "Nonempty contiguous label samples required.");
  input.stateLabels.forEach((v) => count(v, "stateLabels"));
  count(input.targetState, "targetState");
  positive(input.sampleRateHz, "sampleRateHz");
  let targetEntryCount = 0;
  for (let i = 1; i < input.stateLabels.length; i++)
    if (
      input.stateLabels[i] === input.targetState &&
      input.stateLabels[i - 1] !== input.targetState
    )
      targetEntryCount++;
  const recordingSeconds = input.stateLabels.length / input.sampleRateHz;
  return {
    targetEntryCount,
    entriesPerSecond: targetEntryCount / recordingSeconds,
    recordingSeconds,
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
  targetEntryCount: 1,
  entriesPerSecond: 16.666666666666668,
  recordingSeconds: 0.06,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "neuroscience/eeg-microstate-transition-occurrences",
  title: "EEG Microstate Occurrence",
  description:
    "Count observed transitions into a target EEG microstate per recording second, excluding the initial partial run; this differs from mean run duration and coverage.",
  inputs: inputFields,
  outputs: [
    { id: "targetEntryCount", label: "Target entry count", kind: "number" },
    { id: "entriesPerSecond", label: "Entries per second", kind: "number" },
    { id: "recordingSeconds", label: "Recording seconds", kind: "number" },
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
