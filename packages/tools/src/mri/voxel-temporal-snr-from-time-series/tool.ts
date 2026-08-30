import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, positive, variance, mean } from "../shared.js";
export type Input = Readonly<{
  readonly timeSeriesByVoxel: readonly (readonly number[])[];
}>;
export type Output = Readonly<{
  readonly meanSignals: readonly number[];
  readonly sampleStandardDeviations: readonly number[];
  readonly temporalSnrValues: readonly number[];
}>;
const inputFields = [
  { id: "timeSeriesByVoxel", label: "Time series by voxel", kind: "matrix" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  if (!input.timeSeriesByVoxel.length)
    simpleError("timeSeriesByVoxel", "Nonempty voxel time series required.");
  const length = input.timeSeriesByVoxel[0].length;
  if (
    length < 2 ||
    input.timeSeriesByVoxel.some((row) => row.length !== length)
  )
    simpleError(
      "timeSeriesByVoxel",
      "Equal time-series lengths of at least two samples required.",
    );
  const meanSignals = input.timeSeriesByVoxel.map(mean),
    sampleStandardDeviations = input.timeSeriesByVoxel.map((row) =>
      positive(Math.sqrt(variance(row)), "timeSeriesByVoxel"),
    );
  return {
    meanSignals,
    sampleStandardDeviations,
    temporalSnrValues: meanSignals.map(
      (v, i) => v / sampleStandardDeviations[i],
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  timeSeriesByVoxel: [
    [9, 10, 11],
    [4, 6, 8],
  ],
} satisfies Input;
export const exampleOutput = {
  meanSignals: [10, 6],
  sampleStandardDeviations: [1, 2],
  temporalSnrValues: [10, 3],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "mri/voxel-temporal-snr-from-time-series",
  title: "Temporal SNR tSNR",
  description:
    "Compute per-voxel temporal SNR using sample SD without detrending; constant series have undefined infinite tSNR and return an error, not a fabricated finite value.",
  inputs: inputFields,
  outputs: [
    { id: "meanSignals", label: "Mean signals", kind: "numberList" },
    {
      id: "sampleStandardDeviations",
      label: "Sample standard deviations",
      kind: "numberList",
    },
    {
      id: "temporalSnrValues",
      label: "Temporal snr values",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      timeSeriesByVoxel:
        value.timeSeriesByVoxel as readonly (readonly number[])[],
    }),
});
export const run = tool.execute;
export default tool;
