import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, ordered, mean, variance } from "../shared.js";
export type Input = Readonly<{
  readonly spikeTimesMs: readonly number[];
}>;
export type Output = Readonly<{
  readonly meanIsiMs: number;
  readonly sampleIsiStandardDeviationMs: number;
  readonly isiCv: number;
}>;
const inputFields = [
  { id: "spikeTimesMs", label: "Spike times ms", kind: "numberList" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  ordered(input.spikeTimesMs, "spikeTimesMs");
  if (input.spikeTimesMs.length < 3)
    simpleError(
      "spikeTimesMs",
      "At least three spikes required for sample ISI variability.",
    );
  const isi = input.spikeTimesMs
      .slice(1)
      .map((v, i) => v - input.spikeTimesMs[i]),
    meanIsiMs = mean(isi),
    sampleIsiStandardDeviationMs = Math.sqrt(variance(isi));
  return {
    meanIsiMs,
    sampleIsiStandardDeviationMs,
    isiCv: sampleIsiStandardDeviationMs / meanIsiMs,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = { spikeTimesMs: [0, 1, 3, 6] } satisfies Input;
export const exampleOutput = {
  meanIsiMs: 2,
  sampleIsiStandardDeviationMs: 1,
  isiCv: 0.5,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "neuroscience/spike-interval-cv",
  title: "Coefficient of Variation ISI",
  description:
    "Derive consecutive interspike intervals from ordered timestamps and calculate sample CV; differs from a generic CV of supplied measurements.",
  inputs: inputFields,
  outputs: [
    { id: "meanIsiMs", label: "Mean isi ms", kind: "number" },
    {
      id: "sampleIsiStandardDeviationMs",
      label: "Sample isi standard deviation ms",
      kind: "number",
    },
    { id: "isiCv", label: "Isi cv", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      spikeTimesMs: value.spikeTimesMs as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
