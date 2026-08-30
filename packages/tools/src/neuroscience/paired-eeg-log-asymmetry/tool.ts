import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive, aligned, mean } from "../shared.js";
export type Input = Readonly<{
  readonly leftEpochPowers: readonly number[];
  readonly rightEpochPowers: readonly number[];
}>;
export type Output = Readonly<{
  readonly epochLogAsymmetries: readonly number[];
  readonly meanLogAsymmetry: number;
}>;
const inputFields = [
  { id: "leftEpochPowers", label: "Left epoch powers", kind: "numberList" },
  { id: "rightEpochPowers", label: "Right epoch powers", kind: "numberList" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  aligned(input.leftEpochPowers, input.rightEpochPowers, "leftEpochPowers");
  input.leftEpochPowers.forEach((v) => positive(v, "leftEpochPowers"));
  input.rightEpochPowers.forEach((v) => positive(v, "rightEpochPowers"));
  const epochLogAsymmetries = input.leftEpochPowers.map(
    (v, i) => Math.log(input.rightEpochPowers[i]) - Math.log(v),
  );
  return { epochLogAsymmetries, meanLogAsymmetry: mean(epochLogAsymmetries) };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  leftEpochPowers: [1, 4],
  rightEpochPowers: [2, 8],
} satisfies Input;
export const exampleOutput = {
  epochLogAsymmetries: [0.6931471805599453, 0.6931471805599453],
  meanLogAsymmetry: 0.6931471805599453,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "neuroscience/paired-eeg-log-asymmetry",
  title: "EEG Asymmetry Index",
  description:
    "Compute epoch-paired ln(right power)−ln(left power) and its average; electrodes, band selection, referencing and artifact rejection are caller responsibilities.",
  inputs: inputFields,
  outputs: [
    {
      id: "epochLogAsymmetries",
      label: "Epoch log asymmetries",
      kind: "numberList",
    },
    { id: "meanLogAsymmetry", label: "Mean log asymmetry", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      leftEpochPowers: value.leftEpochPowers as readonly number[],
      rightEpochPowers: value.rightEpochPowers as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
