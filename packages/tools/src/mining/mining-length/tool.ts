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
  readonly observedMiningLengthM: readonly number[];
  readonly callerIndependentlyMarkedMiningLengthTargetM: readonly number[];
  readonly observedMiningLengthSurveyWeights: readonly number[];
}>;
export type Output = Readonly<{
  readonly signedExtractionDimensionDeviationsM: readonly number[];
  readonly surveyWeightedSignedDeviationM: number;
}>;
const inputFields = [
  {
    id: "observedMiningLengthM",
    label: "Observed mining length m",
    kind: "numberList",
  },
  {
    id: "callerIndependentlyMarkedMiningLengthTargetM",
    label: "Caller independently marked mining length target m",
    kind: "numberList",
  },
  {
    id: "observedMiningLengthSurveyWeights",
    label: "Observed mining length survey weights",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedMiningLengthM.forEach((v) =>
    nonnegative(v, "observedMiningLengthM"),
  );
  input.callerIndependentlyMarkedMiningLengthTargetM.forEach((v) =>
    nonnegative(v, "callerIndependentlyMarkedMiningLengthTargetM"),
  );
  input.observedMiningLengthSurveyWeights.forEach((v) =>
    nonnegative(v, "observedMiningLengthSurveyWeights"),
  );
  aligned(
    input.observedMiningLengthM,
    input.callerIndependentlyMarkedMiningLengthTargetM,
    "observedMiningLengthM",
  );
  aligned(
    input.observedMiningLengthM,
    input.observedMiningLengthSurveyWeights,
    "observedMiningLengthM",
  );
  const differences = input.observedMiningLengthM.map(
      (v, i) => v - input.callerIndependentlyMarkedMiningLengthTargetM[i],
    ),
    w = weights(input.observedMiningLengthSurveyWeights);
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
  observedMiningLengthM: [2, 4],
  callerIndependentlyMarkedMiningLengthTargetM: [3, 3],
  observedMiningLengthSurveyWeights: [1, 2],
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
  id: "mining/mining-length",
  title: "Mining Length Calculator",
  description:
    "Reconcile independently surveyed actual MiningLength against already established extraction marks with physical survey weights; no room/stope geometry design or permitted mining dimensions. Caller independently verifies units, applicability and matching conditions; no operational recipe, safety certification, causal efficacy or legal/resource classification is inferred.",
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
      observedMiningLengthM: value.observedMiningLengthM as readonly number[],
      callerIndependentlyMarkedMiningLengthTargetM:
        value.callerIndependentlyMarkedMiningLengthTargetM as readonly number[],
      observedMiningLengthSurveyWeights:
        value.observedMiningLengthSurveyWeights as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
