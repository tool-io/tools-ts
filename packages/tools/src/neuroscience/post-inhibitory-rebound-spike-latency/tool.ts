import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish } from "../shared.js";
export type Input = Readonly<{
  readonly spikeTimesMs: readonly number[];
  readonly inhibitionEndMs: number;
  readonly observationEndMs: number;
}>;
export type Output = Readonly<{
  readonly reboundObserved: boolean;
  readonly latencyMs: number;
}>;
const inputFields = [
  { id: "spikeTimesMs", label: "Spike times ms", kind: "numberList" },
  { id: "inhibitionEndMs", label: "Inhibition end ms", kind: "number" },
  { id: "observationEndMs", label: "Observation end ms", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  if (input.observationEndMs < input.inhibitionEndMs)
    simpleError(
      "observationEndMs",
      "Observation must extend beyond inhibition release.",
    );
  if (
    input.spikeTimesMs.some((v, i) => i > 0 && v <= input.spikeTimesMs[i - 1])
  )
    simpleError(
      "spikeTimesMs",
      "Increasing distinct spike timestamps required.",
    );
  const index = input.spikeTimesMs.findIndex(
    (v) => v >= input.inhibitionEndMs && v <= input.observationEndMs,
  );
  return {
    reboundObserved: index >= 0,
    latencyMs:
      index < 0 ? 0 : input.spikeTimesMs[index] - input.inhibitionEndMs,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  spikeTimesMs: [5, 15, 25],
  inhibitionEndMs: 10,
  observationEndMs: 30,
} satisfies Input;
export const exampleOutput = {
  reboundObserved: true,
  latencyMs: 5,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "neuroscience/post-inhibitory-rebound-spike-latency",
  title: "Post-Inhibitory Rebound Latency",
  description:
    "Find the first spike after inhibition release within a finite observation window; zero latency with reboundObserved=false is an explicit nondetection, not an inferred event.",
  inputs: inputFields,
  outputs: [
    { id: "reboundObserved", label: "Rebound observed", kind: "boolean" },
    { id: "latencyMs", label: "Latency ms", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      spikeTimesMs: value.spikeTimesMs as readonly number[],
      inhibitionEndMs: value.inhibitionEndMs as number,
      observationEndMs: value.observationEndMs as number,
    }),
});
export const run = tool.execute;
export default tool;
