import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive, mean } from "../shared.js";
export type Input = Readonly<{
  readonly reflectionAmplitudeSamples: readonly number[];
  readonly noiseAmplitudeSamples: readonly number[];
  readonly callerMinimumAmplitudeSnr: number;
}>;
export type Output = Readonly<{
  readonly reflectionRmsAmplitude: number;
  readonly noiseRmsAmplitude: number;
  readonly amplitudeSnr: number;
  readonly aboveCallerFeatureThreshold: boolean;
}>;
const inputFields = [
  {
    id: "reflectionAmplitudeSamples",
    label: "Reflection amplitude samples",
    kind: "numberList",
  },
  {
    id: "noiseAmplitudeSamples",
    label: "Noise amplitude samples",
    kind: "numberList",
  },
  {
    id: "callerMinimumAmplitudeSnr",
    label: "Caller minimum amplitude snr",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.callerMinimumAmplitudeSnr, "callerMinimumAmplitudeSnr");
  const reflectionRmsAmplitude = Math.sqrt(
      mean(input.reflectionAmplitudeSamples.map((v) => v * v)),
    ),
    noiseRmsAmplitude = Math.sqrt(
      positive(
        mean(input.noiseAmplitudeSamples.map((v) => v * v)),
        "noiseAmplitudeSamples",
      ),
    ),
    amplitudeSnr = reflectionRmsAmplitude / noiseRmsAmplitude;
  return {
    reflectionRmsAmplitude,
    noiseRmsAmplitude,
    amplitudeSnr,
    aboveCallerFeatureThreshold:
      amplitudeSnr >= input.callerMinimumAmplitudeSnr,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  reflectionAmplitudeSamples: [-2, 2],
  noiseAmplitudeSamples: [-1, 1],
  callerMinimumAmplitudeSnr: 2,
} satisfies Input;
export const exampleOutput = {
  reflectionRmsAmplitude: 2,
  noiseRmsAmplitude: 1,
  amplitudeSnr: 2,
  aboveCallerFeatureThreshold: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "archaeology/gpr-reflection-amplitude-feature",
  title: "GPR Reflection Amplitude Feature Tool",
  description:
    "Screen caller selected GPR reflection/noise amplitude windows using RMS SNR; assumes matched gain/processing and does not identify feature material, burial or archaeological origin.",
  inputs: inputFields,
  outputs: [
    {
      id: "reflectionRmsAmplitude",
      label: "Reflection rms amplitude",
      kind: "number",
    },
    { id: "noiseRmsAmplitude", label: "Noise rms amplitude", kind: "number" },
    { id: "amplitudeSnr", label: "Amplitude snr", kind: "number" },
    {
      id: "aboveCallerFeatureThreshold",
      label: "Above caller feature threshold",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      reflectionAmplitudeSamples:
        value.reflectionAmplitudeSamples as readonly number[],
      noiseAmplitudeSamples: value.noiseAmplitudeSamples as readonly number[],
      callerMinimumAmplitudeSnr: value.callerMinimumAmplitudeSnr as number,
    }),
});
export const run = tool.execute;
export default tool;
