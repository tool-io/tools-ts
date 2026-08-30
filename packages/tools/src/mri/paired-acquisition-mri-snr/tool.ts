import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  aligned,
  mean,
  variance,
} from "../shared.js";
export type Input = Readonly<{
  readonly firstAcquisition: readonly number[];
  readonly secondAcquisition: readonly number[];
}>;
export type Output = Readonly<{
  readonly meanPairedSignal: number;
  readonly differenceSampleSd: number;
  readonly singleAcquisitionNoiseSd: number;
  readonly snrEstimate: number;
}>;
const inputFields = [
  { id: "firstAcquisition", label: "First acquisition", kind: "numberList" },
  { id: "secondAcquisition", label: "Second acquisition", kind: "numberList" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  aligned(input.firstAcquisition, input.secondAcquisition, "firstAcquisition");
  const differenceSampleSd = positive(
      Math.sqrt(
        variance(
          input.firstAcquisition.map((v, i) => v - input.secondAcquisition[i]),
        ),
      ),
      "firstAcquisition",
    ),
    singleAcquisitionNoiseSd = differenceSampleSd / Math.sqrt(2),
    meanPairedSignal = mean(
      input.firstAcquisition.map(
        (v, i) => (v + input.secondAcquisition[i]) / 2,
      ),
    );
  return {
    meanPairedSignal,
    differenceSampleSd,
    singleAcquisitionNoiseSd,
    snrEstimate: meanPairedSignal / singleAcquisitionNoiseSd,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  firstAcquisition: [10, 12],
  secondAcquisition: [12, 10],
} satisfies Input;
export const exampleOutput = {
  meanPairedSignal: 11,
  differenceSampleSd: 2.8284271247461903,
  singleAcquisitionNoiseSd: 2,
  snrEstimate: 5.5,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "mri/paired-acquisition-mri-snr",
  title: "SNR From Two Acquisitions",
  description:
    "Estimate SNR from matched independent acquisitions using SD(image1−image2)/√2; drift, motion and mismatched anatomy contaminate the noise estimate.",
  inputs: inputFields,
  outputs: [
    { id: "meanPairedSignal", label: "Mean paired signal", kind: "number" },
    { id: "differenceSampleSd", label: "Difference sample sd", kind: "number" },
    {
      id: "singleAcquisitionNoiseSd",
      label: "Single acquisition noise sd",
      kind: "number",
    },
    { id: "snrEstimate", label: "Snr estimate", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      firstAcquisition: value.firstAcquisition as readonly number[],
      secondAcquisition: value.secondAcquisition as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
