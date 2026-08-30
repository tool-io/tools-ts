import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  aligned,
  variance,
} from "../shared.js";
export type Input = Readonly<{
  readonly firstSpikeTimesMs: readonly number[];
  readonly stimulusTimesMs: readonly number[];
}>;
export type Output = Readonly<{
  readonly latenciesMs: readonly number[];
  readonly latencySampleSdMs: number;
  readonly precisionInverseMs: number;
}>;
const inputFields = [
  {
    id: "firstSpikeTimesMs",
    label: "First spike times ms",
    kind: "numberList",
  },
  { id: "stimulusTimesMs", label: "Stimulus times ms", kind: "numberList" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  aligned(input.firstSpikeTimesMs, input.stimulusTimesMs, "firstSpikeTimesMs");
  const latenciesMs = input.firstSpikeTimesMs.map((v, i) =>
      nonnegative(v - input.stimulusTimesMs[i], "firstSpikeTimesMs"),
    ),
    latencySampleSdMs = positive(
      Math.sqrt(variance(latenciesMs)),
      "firstSpikeTimesMs",
    );
  return {
    latenciesMs,
    latencySampleSdMs,
    precisionInverseMs: 1 / latencySampleSdMs,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  firstSpikeTimesMs: [11, 12, 13],
  stimulusTimesMs: [10, 10, 10],
} satisfies Input;
export const exampleOutput = {
  latenciesMs: [1, 2, 3],
  latencySampleSdMs: 1,
  precisionInverseMs: 1,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "neuroscience/trial-spike-timing-precision",
  title: "Spike Timing Precision",
  description:
    "Derive per-trial stimulus-aligned first-spike latencies and inverse sample SD precision; identical latencies have undefined infinite precision and return an error.",
  inputs: inputFields,
  outputs: [
    { id: "latenciesMs", label: "Latencies ms", kind: "numberList" },
    { id: "latencySampleSdMs", label: "Latency sample sd ms", kind: "number" },
    { id: "precisionInverseMs", label: "Precision inverse ms", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      firstSpikeTimesMs: value.firstSpikeTimesMs as readonly number[],
      stimulusTimesMs: value.stimulusTimesMs as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
