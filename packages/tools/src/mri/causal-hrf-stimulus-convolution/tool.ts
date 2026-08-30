import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, positive } from "../shared.js";
export type Input = Readonly<{
  readonly stimulusSamples: readonly number[];
  readonly hrfSamples: readonly number[];
  readonly sampleIntervalSeconds: number;
}>;
export type Output = Readonly<{
  readonly convolvedSignal: readonly number[];
}>;
const inputFields = [
  { id: "stimulusSamples", label: "Stimulus samples", kind: "numberList" },
  { id: "hrfSamples", label: "Hrf samples", kind: "numberList" },
  {
    id: "sampleIntervalSeconds",
    label: "Sample interval seconds",
    kind: "number",
    unit: "s",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  if (
    !input.stimulusSamples.length ||
    !input.hrfSamples.length ||
    input.stimulusSamples.length * input.hrfSamples.length > 1000000
  )
    simpleError(
      "stimulusSamples",
      "Nonempty bounded convolution vectors required.",
    );
  positive(input.sampleIntervalSeconds, "sampleIntervalSeconds");
  const convolvedSignal = input.stimulusSamples.map((_, i) => {
    let value = 0;
    for (let k = 0; k < input.hrfSamples.length && k <= i; k++)
      value += input.stimulusSamples[i - k] * input.hrfSamples[k];
    return value * input.sampleIntervalSeconds;
  });
  return { convolvedSignal };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  stimulusSamples: [1, 0, 1],
  hrfSamples: [1, 0.5],
  sampleIntervalSeconds: 1,
} satisfies Input;
export const exampleOutput = { convolvedSignal: [1, 0.5, 1] } satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "mri/causal-hrf-stimulus-convolution",
  title: "GLM HRF Convolution",
  description:
    "Compute causal same-length discrete convolution with explicit Δt scaling for a sampled stimulus-rate function; event impulses must be converted to rate samples and no GLM is fitted.",
  inputs: inputFields,
  outputs: [
    { id: "convolvedSignal", label: "Convolved signal", kind: "numberList" },
  ],
  calculate: (value) =>
    calculate({
      stimulusSamples: value.stimulusSamples as readonly number[],
      hrfSamples: value.hrfSamples as readonly number[],
      sampleIntervalSeconds: value.sampleIntervalSeconds as number,
    }),
});
export const run = tool.execute;
export default tool;
