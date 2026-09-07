import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  linearFit,
} from "../batch36-shared.js";
export type Input = Readonly<{
  readonly observedMemsRingdownTimesSeconds: readonly number[];
  readonly observedMemsAmplitude: readonly number[];
  readonly observedMemsFrequencyHz: number;
}>;
export type Output = Readonly<{
  readonly extractedAmplitudeDecaySeconds: number;
  readonly extractedMemsRingdownQ: number;
}>;
const inputFields = [
  {
    id: "observedMemsRingdownTimesSeconds",
    label: "Observed mems ringdown times seconds",
    kind: "numberList",
  },
  {
    id: "observedMemsAmplitude",
    label: "Observed mems amplitude",
    kind: "numberList",
  },
  {
    id: "observedMemsFrequencyHz",
    label: "Observed mems frequency hz",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedMemsAmplitude.forEach((v) =>
    positive(v, "observedMemsAmplitude"),
  );
  positive(input.observedMemsFrequencyHz, "observedMemsFrequencyHz");
  input.observedMemsRingdownTimesSeconds.forEach((v) =>
    nonnegative(v, "observedMemsRingdownTimesSeconds"),
  );
  const fit = linearFit(
    input.observedMemsRingdownTimesSeconds,
    input.observedMemsAmplitude.map(Math.log),
  );
  if (fit.slope >= 0)
    simpleError("decay", "Decreasing measured amplitude ringdown required.");
  const tau = -1 / fit.slope;
  return {
    extractedAmplitudeDecaySeconds: tau,
    extractedMemsRingdownQ: Math.PI * input.observedMemsFrequencyHz * tau,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedMemsRingdownTimesSeconds: [0, 1, 2],
  observedMemsAmplitude: [1, 0.5, 0.25],
  observedMemsFrequencyHz: 2,
} satisfies Input;
export const exampleOutput = {
  extractedAmplitudeDecaySeconds: 1.4426950408889634,
  extractedMemsRingdownQ: 9.064720283654388,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "semiconductor/mems-resonator-quality-factor",
  title: "Semiconductor Mems Resonator Quality Factor Calculator",
  description:
    "Extract MEMS Q from actual amplitude ringdown (Q=πfτ amplitude), not frequency/linewidth optical Q or energy-decay factor-of-two convention.",
  inputs: inputFields,
  outputs: [
    {
      id: "extractedAmplitudeDecaySeconds",
      label: "Extracted amplitude decay seconds",
      kind: "number",
    },
    {
      id: "extractedMemsRingdownQ",
      label: "Extracted mems ringdown q",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedMemsRingdownTimesSeconds:
        value.observedMemsRingdownTimesSeconds as readonly number[],
      observedMemsAmplitude: value.observedMemsAmplitude as readonly number[],
      observedMemsFrequencyHz: value.observedMemsFrequencyHz as number,
    }),
});
export const run = tool.execute;
export default tool;
