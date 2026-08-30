import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  mean,
  variance,
} from "../shared.js";
export type Input = Readonly<{
  readonly roiSignals: readonly number[];
  readonly backgroundMagnitudeSignals: readonly number[];
}>;
export type Output = Readonly<{
  readonly meanRoiSignal: number;
  readonly estimatedGaussianNoiseSd: number;
  readonly estimatedSnr: number;
}>;
const inputFields = [
  { id: "roiSignals", label: "Roi signals", kind: "numberList" },
  {
    id: "backgroundMagnitudeSignals",
    label: "Background magnitude signals",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.roiSignals.forEach((v) => nonnegative(v, "roiSignals"));
  input.backgroundMagnitudeSignals.forEach((v) =>
    nonnegative(v, "backgroundMagnitudeSignals"),
  );
  const meanRoiSignal = mean(input.roiSignals),
    estimatedGaussianNoiseSd = positive(
      Math.sqrt(variance(input.backgroundMagnitudeSignals) / (2 - Math.PI / 2)),
      "backgroundMagnitudeSignals",
    );
  return {
    meanRoiSignal,
    estimatedGaussianNoiseSd,
    estimatedSnr: meanRoiSignal / estimatedGaussianNoiseSd,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  roiSignals: [10, 10],
  backgroundMagnitudeSignals: [1, 3],
} satisfies Input;
export const exampleOutput = {
  meanRoiSignal: 10,
  estimatedGaussianNoiseSd: 2.158655221735395,
  estimatedSnr: 4.632513751761042,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "mri/rayleigh-background-mri-snr",
  title: "MRI Signal to Noise Ratio",
  description:
    "Estimate single-channel magnitude MRI SNR using Rayleigh background SD correction; parallel imaging, multicoil noise and spatially varying g factors violate this model.",
  inputs: inputFields,
  outputs: [
    { id: "meanRoiSignal", label: "Mean roi signal", kind: "number" },
    {
      id: "estimatedGaussianNoiseSd",
      label: "Estimated gaussian noise sd",
      kind: "number",
    },
    { id: "estimatedSnr", label: "Estimated snr", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      roiSignals: value.roiSignals as readonly number[],
      backgroundMagnitudeSignals:
        value.backgroundMagnitudeSignals as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
