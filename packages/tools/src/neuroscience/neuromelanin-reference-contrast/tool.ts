import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive, mean, variance } from "../shared.js";
export type Input = Readonly<{
  readonly roiSignals: readonly number[];
  readonly referenceSignals: readonly number[];
}>;
export type Output = Readonly<{
  readonly roiMean: number;
  readonly referenceMean: number;
  readonly contrastPercent: number;
  readonly contrastToNoiseRatio: number;
}>;
const inputFields = [
  { id: "roiSignals", label: "Roi signals", kind: "numberList" },
  { id: "referenceSignals", label: "Reference signals", kind: "numberList" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.roiSignals.forEach((v) => positive(v, "roiSignals"));
  input.referenceSignals.forEach((v) => positive(v, "referenceSignals"));
  const roiMean = mean(input.roiSignals),
    referenceMean = positive(mean(input.referenceSignals), "referenceSignals"),
    noise = positive(
      Math.sqrt(variance(input.referenceSignals)),
      "referenceSignals",
    );
  return {
    roiMean,
    referenceMean,
    contrastPercent: (100 * (roiMean - referenceMean)) / referenceMean,
    contrastToNoiseRatio: (roiMean - referenceMean) / noise,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  roiSignals: [120, 140],
  referenceSignals: [90, 100, 110],
} satisfies Input;
export const exampleOutput = {
  roiMean: 130,
  referenceMean: 100,
  contrastPercent: 30,
  contrastToNoiseRatio: 3,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "neuroscience/neuromelanin-reference-contrast",
  title: "Neuromelanin Contrast",
  description:
    "Compute neuromelanin-sensitive ROI/reference contrast and CNR using reference sample SD; scanner sequence and ROI selection are external, and contrast is not neuron density.",
  inputs: inputFields,
  outputs: [
    { id: "roiMean", label: "Roi mean", kind: "number" },
    { id: "referenceMean", label: "Reference mean", kind: "number" },
    { id: "contrastPercent", label: "Contrast percent", kind: "number" },
    {
      id: "contrastToNoiseRatio",
      label: "Contrast to noise ratio",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      roiSignals: value.roiSignals as readonly number[],
      referenceSignals: value.referenceSignals as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
