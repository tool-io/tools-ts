import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive, mean, variance } from "../shared.js";
export type Input = Readonly<{
  readonly firstRoiSignals: readonly number[];
  readonly secondRoiSignals: readonly number[];
  readonly noiseDifferenceSignals: readonly number[];
}>;
export type Output = Readonly<{
  readonly firstRoiMean: number;
  readonly secondRoiMean: number;
  readonly singleAcquisitionNoiseSd: number;
  readonly contrastToNoiseRatio: number;
}>;
const inputFields = [
  { id: "firstRoiSignals", label: "First roi signals", kind: "numberList" },
  { id: "secondRoiSignals", label: "Second roi signals", kind: "numberList" },
  {
    id: "noiseDifferenceSignals",
    label: "Noise difference signals",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  const firstRoiMean = mean(input.firstRoiSignals),
    secondRoiMean = mean(input.secondRoiSignals),
    singleAcquisitionNoiseSd = positive(
      Math.sqrt(variance(input.noiseDifferenceSignals) / 2),
      "noiseDifferenceSignals",
    );
  return {
    firstRoiMean,
    secondRoiMean,
    singleAcquisitionNoiseSd,
    contrastToNoiseRatio:
      (firstRoiMean - secondRoiMean) / singleAcquisitionNoiseSd,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  firstRoiSignals: [10, 12],
  secondRoiSignals: [4, 6],
  noiseDifferenceSignals: [-1, 1],
} satisfies Input;
export const exampleOutput = {
  firstRoiMean: 11,
  secondRoiMean: 5,
  singleAcquisitionNoiseSd: 1,
  contrastToNoiseRatio: 6,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "mri/two-roi-difference-noise-cnr",
  title: "Contrast to Noise Ratio",
  description:
    "Estimate signed two-ROI CNR using difference-noise SD/√2 from independent matched acquisitions; unlike reference-ROI contrast metrics, the noise estimate is independent.",
  inputs: inputFields,
  outputs: [
    { id: "firstRoiMean", label: "First roi mean", kind: "number" },
    { id: "secondRoiMean", label: "Second roi mean", kind: "number" },
    {
      id: "singleAcquisitionNoiseSd",
      label: "Single acquisition noise sd",
      kind: "number",
    },
    {
      id: "contrastToNoiseRatio",
      label: "Contrast to noise ratio",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      firstRoiSignals: value.firstRoiSignals as readonly number[],
      secondRoiSignals: value.secondRoiSignals as readonly number[],
      noiseDifferenceSignals: value.noiseDifferenceSignals as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
