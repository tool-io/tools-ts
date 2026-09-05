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
  readonly observedMiningHeightM: readonly number[];
  readonly callerIndependentlyMarkedMiningHeightTargetM: readonly number[];
  readonly observedMiningHeightSurveyWeights: readonly number[];
}>;
export type Output = Readonly<{
  readonly signedExtractionDimensionDeviationsM: readonly number[];
  readonly surveyWeightedSignedDeviationM: number;
}>;
const inputFields = [
  {
    id: "observedMiningHeightM",
    label: "Observed mining height m",
    kind: "numberList",
  },
  {
    id: "callerIndependentlyMarkedMiningHeightTargetM",
    label: "Caller independently marked mining height target m",
    kind: "numberList",
  },
  {
    id: "observedMiningHeightSurveyWeights",
    label: "Observed mining height survey weights",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedMiningHeightM.forEach((v) =>
    nonnegative(v, "observedMiningHeightM"),
  );
  input.callerIndependentlyMarkedMiningHeightTargetM.forEach((v) =>
    nonnegative(v, "callerIndependentlyMarkedMiningHeightTargetM"),
  );
  input.observedMiningHeightSurveyWeights.forEach((v) =>
    nonnegative(v, "observedMiningHeightSurveyWeights"),
  );
  aligned(
    input.observedMiningHeightM,
    input.callerIndependentlyMarkedMiningHeightTargetM,
    "observedMiningHeightM",
  );
  aligned(
    input.observedMiningHeightM,
    input.observedMiningHeightSurveyWeights,
    "observedMiningHeightM",
  );
  const differences = input.observedMiningHeightM.map(
      (v, i) => v - input.callerIndependentlyMarkedMiningHeightTargetM[i],
    ),
    w = weights(input.observedMiningHeightSurveyWeights);
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
  observedMiningHeightM: [2, 4],
  callerIndependentlyMarkedMiningHeightTargetM: [3, 3],
  observedMiningHeightSurveyWeights: [1, 2],
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
  id: "mining/mining-height",
  title: "Mining Height Calculator",
  description:
    "Reconcile independently surveyed actual MiningHeight against already established extraction marks with physical survey weights; no room/stope geometry design or permitted mining dimensions. Caller independently verifies units, applicability and matching conditions; no operational recipe, safety certification, causal efficacy or legal/resource classification is inferred.",
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
      observedMiningHeightM: value.observedMiningHeightM as readonly number[],
      callerIndependentlyMarkedMiningHeightTargetM:
        value.callerIndependentlyMarkedMiningHeightTargetM as readonly number[],
      observedMiningHeightSurveyWeights:
        value.observedMiningHeightSurveyWeights as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
