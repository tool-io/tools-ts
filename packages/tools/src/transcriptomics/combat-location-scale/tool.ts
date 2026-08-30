import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly sampleValues: readonly number[];
  readonly batchMean: number;
  readonly batchStandardDeviation: number;
  readonly pooledMean: number;
  readonly pooledStandardDeviation: number;
}>;
export type Output = Readonly<{
  readonly adjustedValues: readonly number[];
  readonly batchMeanShift: number;
}>;

export const calculate = (input: Input): Output => {
  if (input.batchStandardDeviation <= 0 || input.pooledStandardDeviation <= 0)
    simpleError(
      "batchStandardDeviation",
      "Batch and pooled standard deviations must be positive.",
    );
  return {
    adjustedValues: input.sampleValues.map(
      (v) =>
        ((v - input.batchMean) / input.batchStandardDeviation) *
          input.pooledStandardDeviation +
        input.pooledMean,
    ),
    batchMeanShift: input.pooledMean - input.batchMean,
  };
};

export const exampleInput = {
  sampleValues: [10, 12],
  batchMean: 11,
  batchStandardDeviation: 1,
  pooledMean: 20,
  pooledStandardDeviation: 2,
} satisfies Input;
export const exampleOutput = {
  adjustedValues: [18, 22],
  batchMeanShift: 9,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  id: "transcriptomics/combat-location-scale",
  title: "Combat Location Scale",
  description:
    "Recenter and rescale batch samples using caller-estimated location and scale parameters.",
  inputs: [
    { id: "sampleValues", kind: "numberList", label: "Sample values" },
    { id: "batchMean", kind: "number", label: "Batch mean" },
    {
      id: "batchStandardDeviation",
      kind: "number",
      label: "Batch standard deviation",
    },
    { id: "pooledMean", kind: "number", label: "Pooled mean" },
    {
      id: "pooledStandardDeviation",
      kind: "number",
      label: "Pooled standard deviation",
    },
  ],
  outputs: [
    { id: "adjustedValues", kind: "numberList", label: "Adjusted values" },
    { id: "batchMeanShift", kind: "number", label: "Batch mean shift" },
  ],
  calculate: (value) =>
    calculate({
      sampleValues: value.sampleValues as readonly number[],
      batchMean: value.batchMean as number,
      batchStandardDeviation: value.batchStandardDeviation as number,
      pooledMean: value.pooledMean as number,
      pooledStandardDeviation: value.pooledStandardDeviation as number,
    }),
});
export const run = tool.execute;
export default tool;
