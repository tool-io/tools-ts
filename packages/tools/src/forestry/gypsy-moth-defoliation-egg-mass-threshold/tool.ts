import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  fraction,
  count,
  aligned,
} from "../shared.js";
export type Input = Readonly<{
  readonly observedEggMassCounts: readonly number[];
  readonly surveyedAreasHa: readonly number[];
  readonly detectionProbabilities: readonly number[];
  readonly callerEggMassDensityThresholdPerHa: number;
}>;
export type Output = Readonly<{
  readonly adjustedEggMassDensitiesPerHa: readonly number[];
  readonly aboveCallerThresholdFlags: readonly number[];
  readonly pooledAdjustedEggMassDensityPerHa: number;
}>;
const inputFields = [
  {
    id: "observedEggMassCounts",
    label: "Observed egg mass counts",
    kind: "numberList",
  },
  { id: "surveyedAreasHa", label: "Surveyed areas ha", kind: "numberList" },
  {
    id: "detectionProbabilities",
    label: "Detection probabilities",
    kind: "numberList",
  },
  {
    id: "callerEggMassDensityThresholdPerHa",
    label: "Caller egg mass density threshold per ha",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.surveyedAreasHa.forEach((v) => positive(v, "surveyedAreasHa"));
  input.detectionProbabilities.forEach((v) =>
    positive(v, "detectionProbabilities"),
  );
  nonnegative(
    input.callerEggMassDensityThresholdPerHa,
    "callerEggMassDensityThresholdPerHa",
  );
  input.detectionProbabilities.forEach((v) =>
    fraction(v, "detectionProbabilities"),
  );
  input.observedEggMassCounts.forEach((v) => count(v, "observedEggMassCounts"));
  aligned(
    input.observedEggMassCounts,
    input.surveyedAreasHa,
    "observedEggMassCounts",
  );
  aligned(
    input.observedEggMassCounts,
    input.detectionProbabilities,
    "observedEggMassCounts",
  );
  const adjusted = input.observedEggMassCounts.map(
      (v, i) => v / input.detectionProbabilities[i],
    ),
    adjustedEggMassDensitiesPerHa = adjusted.map(
      (v, i) => v / input.surveyedAreasHa[i],
    );
  return {
    adjustedEggMassDensitiesPerHa,
    aboveCallerThresholdFlags: adjustedEggMassDensitiesPerHa.map((v) =>
      v > input.callerEggMassDensityThresholdPerHa ? 1 : 0,
    ),
    pooledAdjustedEggMassDensityPerHa:
      adjusted.reduce((a, b) => a + b, 0) /
      input.surveyedAreasHa.reduce((a, b) => a + b, 0),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedEggMassCounts: [10, 20],
  surveyedAreasHa: [0.1, 0.2],
  detectionProbabilities: [0.5, 1],
  callerEggMassDensityThresholdPerHa: 150,
} satisfies Input;
export const exampleOutput = {
  adjustedEggMassDensitiesPerHa: [200, 100],
  aboveCallerThresholdFlags: [1, 0],
  pooledAdjustedEggMassDensityPerHa: 133.33333333333334,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "forestry/gypsy-moth-defoliation-egg-mass-threshold",
  title: "Gypsy Moth Egg-Mass Defoliation Threshold Checker",
  description:
    "Screen observed egg-mass surveys with differential detection against caller density threshold; no embedded outbreak/defoliation model, species attribution or treatment recommendation.",
  inputs: inputFields,
  outputs: [
    {
      id: "adjustedEggMassDensitiesPerHa",
      label: "Adjusted egg mass densities per ha",
      kind: "numberList",
    },
    {
      id: "aboveCallerThresholdFlags",
      label: "Above caller threshold flags",
      kind: "numberList",
    },
    {
      id: "pooledAdjustedEggMassDensityPerHa",
      label: "Pooled adjusted egg mass density per ha",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedEggMassCounts: value.observedEggMassCounts as readonly number[],
      surveyedAreasHa: value.surveyedAreasHa as readonly number[],
      detectionProbabilities: value.detectionProbabilities as readonly number[],
      callerEggMassDensityThresholdPerHa:
        value.callerEggMassDensityThresholdPerHa as number,
    }),
});
export const run = tool.execute;
export default tool;
