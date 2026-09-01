import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive, bounded } from "../batch35-shared.js";
export type Input = Readonly<{
  readonly observedAgeYears: number;
  readonly observedPeakHeartRateBpm: number;
}>;
export type Output = Readonly<{
  readonly populationRegressionMaxHeartRateBpm: number;
  readonly signedObservedMinusPopulationEstimateBpm: number;
}>;
const inputFields = [
  { id: "observedAgeYears", label: "Observed age years", kind: "number" },
  {
    id: "observedPeakHeartRateBpm",
    label: "Observed peak heart rate bpm",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  bounded(input.observedAgeYears, "age", 18, 100);
  positive(input.observedPeakHeartRateBpm, "peak");
  const estimate = 206 - 0.88 * input.observedAgeYears;
  return {
    populationRegressionMaxHeartRateBpm: estimate,
    signedObservedMinusPopulationEstimateBpm:
      input.observedPeakHeartRateBpm - estimate,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedAgeYears: 40,
  observedPeakHeartRateBpm: 170,
} satisfies Input;
export const exampleOutput = {
  populationRegressionMaxHeartRateBpm: 170.8,
  signedObservedMinusPopulationEstimateBpm: -0.8000000000000114,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "sports/max-hr-gulati-female",
  title: "Gulati Female Max HR Formula",
  description:
    "Calculate named Gulati female-cohort adult population maximum-HR regression and signed actual peak discrepancy; not individual measured maximum, universal sex/gender inference, medical limit or exercise advice.",
  inputs: inputFields,
  outputs: [
    {
      id: "populationRegressionMaxHeartRateBpm",
      label: "Population regression max heart rate bpm",
      kind: "number",
    },
    {
      id: "signedObservedMinusPopulationEstimateBpm",
      label: "Signed observed minus population estimate bpm",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedAgeYears: value.observedAgeYears as number,
      observedPeakHeartRateBpm: value.observedPeakHeartRateBpm as number,
    }),
});
export const run = tool.execute;
export default tool;
