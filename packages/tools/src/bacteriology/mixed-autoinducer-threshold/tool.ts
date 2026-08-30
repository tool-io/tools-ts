import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";
import { positive, nonnegative, aligned } from "../shared.js";

export type Input = Readonly<{
  readonly sourceConcentrations: readonly number[];
  readonly sourceVolumesMl: readonly number[];
  readonly diluentVolumeMl: number;
  readonly activationThreshold: number;
}>;
export type Output = Readonly<{
  readonly mixedConcentration: number;
  readonly activationThresholdMet: boolean;
  readonly totalVolumeMl: number;
}>;
export const calculate = (input: Input): Output => {
  aligned(
    input.sourceConcentrations,
    input.sourceVolumesMl,
    "sourceConcentrations",
  );
  input.sourceConcentrations.forEach((v) =>
    nonnegative(v, "sourceConcentrations"),
  );
  input.sourceVolumesMl.forEach((v) => positive(v, "sourceVolumesMl"));
  nonnegative(input.diluentVolumeMl, "diluentVolumeMl");
  positive(input.activationThreshold, "activationThreshold");
  const totalVolumeMl =
      input.sourceVolumesMl.reduce((a, b) => a + b, 0) + input.diluentVolumeMl,
    mixedConcentration =
      input.sourceConcentrations.reduce(
        (sum, v, i) => sum + v * input.sourceVolumesMl[i],
        0,
      ) / totalVolumeMl;
  return {
    mixedConcentration,
    activationThresholdMet: mixedConcentration >= input.activationThreshold,
    totalVolumeMl,
  };
};
export const exampleInput = {
  sourceConcentrations: [10, 20],
  sourceVolumesMl: [1, 1],
  diluentVolumeMl: 2,
  activationThreshold: 8,
} satisfies Input;
export const exampleOutput = {
  mixedConcentration: 7.5,
  activationThresholdMet: false,
  totalVolumeMl: 4,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "bacteriology/mixed-autoinducer-threshold",
  title: "Mixed Autoinducer Threshold",
  description:
    "Screen a volume-weighted mixed autoinducer concentration against a supplied activation threshold, assuming no degradation or matrix effects.",
  inputs: [
    {
      id: "sourceConcentrations",
      label: "Source concentrations",
      kind: "numberList",
    },
    { id: "sourceVolumesMl", label: "Source volumes ml", kind: "numberList" },
    {
      id: "diluentVolumeMl",
      label: "Diluent volume ml",
      kind: "number",
      minimum: 0,
    },
    {
      id: "activationThreshold",
      label: "Activation threshold",
      kind: "number",
    },
  ],
  outputs: [
    { id: "mixedConcentration", label: "Mixed concentration", kind: "number" },
    {
      id: "activationThresholdMet",
      label: "Activation threshold met",
      kind: "boolean",
    },
    { id: "totalVolumeMl", label: "Total volume ml", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      sourceConcentrations: value.sourceConcentrations as readonly number[],
      sourceVolumesMl: value.sourceVolumesMl as readonly number[],
      diluentVolumeMl: value.diluentVolumeMl as number,
      activationThreshold: value.activationThreshold as number,
    }),
});
export const run = tool.execute;
export default tool;
