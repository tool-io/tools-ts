import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  aligned,
  sum,
  weights,
} from "../batch37-shared.js";
export type Input = Readonly<{
  readonly observedMiningWidthM: readonly number[];
  readonly callerIndependentlyMarkedMiningWidthTargetM: readonly number[];
  readonly observedMiningWidthSurveyWeights: readonly number[];
}>;
export type Output = Readonly<{
  readonly signedExtractionDimensionDeviationsM: readonly number[];
  readonly surveyWeightedSignedDeviationM: number;
}>;
const inputFields = [
  {
    id: "observedMiningWidthM",
    label: "Observed mining width m",
    kind: "numberList",
  },
  {
    id: "callerIndependentlyMarkedMiningWidthTargetM",
    label: "Caller independently marked mining width target m",
    kind: "numberList",
  },
  {
    id: "observedMiningWidthSurveyWeights",
    label: "Observed mining width survey weights",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedMiningWidthM.forEach((v) =>
    nonnegative(v, "observedMiningWidthM"),
  );
  input.callerIndependentlyMarkedMiningWidthTargetM.forEach((v) =>
    nonnegative(v, "callerIndependentlyMarkedMiningWidthTargetM"),
  );
  input.observedMiningWidthSurveyWeights.forEach((v) =>
    nonnegative(v, "observedMiningWidthSurveyWeights"),
  );
  aligned(
    input.observedMiningWidthM,
    input.callerIndependentlyMarkedMiningWidthTargetM,
    "observedMiningWidthM",
  );
  aligned(
    input.observedMiningWidthM,
    input.observedMiningWidthSurveyWeights,
    "observedMiningWidthM",
  );
  const differences = input.observedMiningWidthM.map(
      (v, i) => v - input.callerIndependentlyMarkedMiningWidthTargetM[i],
    ),
    w = weights(input.observedMiningWidthSurveyWeights);
  return {
    signedExtractionDimensionDeviationsM: differences,
    surveyWeightedSignedDeviationM: sum(differences.map((v, i) => v * w[i])),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedMiningWidthM: [2, 4],
  callerIndependentlyMarkedMiningWidthTargetM: [3, 3],
  observedMiningWidthSurveyWeights: [1, 2],
} satisfies Input;
export const exampleOutput = {
  signedExtractionDimensionDeviationsM: [-1, 1],
  surveyWeightedSignedDeviationM: 0.3333333333333333,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "mining/mining-width",
  title: "Mining Width Calculator",
  description:
    "Reconcile independently surveyed actual MiningWidth against already established extraction marks with physical survey weights; no room/stope geometry design or permitted mining dimensions. Caller independently verifies units, applicability and matching conditions; no operational recipe, safety certification, causal efficacy or legal/resource classification is inferred.",
  inputs: inputFields,
  outputs: [
    {
      id: "signedExtractionDimensionDeviationsM",
      label: "Signed extraction dimension deviations m",
      kind: "numberList",
    },
    {
      id: "surveyWeightedSignedDeviationM",
      label: "Survey weighted signed deviation m",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedMiningWidthM: value.observedMiningWidthM as readonly number[],
      callerIndependentlyMarkedMiningWidthTargetM:
        value.callerIndependentlyMarkedMiningWidthTargetM as readonly number[],
      observedMiningWidthSurveyWeights:
        value.observedMiningWidthSurveyWeights as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
