import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, weightedKnown } from "../batch42-shared.js";
export type Input = Readonly<{
  readonly callerCriterionScores: readonly number[];
  readonly callerCriterionWeights: readonly number[];
  readonly scoreKnownFlags: readonly number[];
}>;
export type Output = Readonly<{
  readonly knownWeightedScore: number;
  readonly knownWeightFraction: number;
  readonly unknownIndices: readonly number[];
}>;
const inputFields = [
  {
    id: "callerCriterionScores",
    label: "Caller criterion scores",
    kind: "numberList",
  },
  {
    id: "callerCriterionWeights",
    label: "Caller criterion weights",
    kind: "numberList",
  },
  { id: "scoreKnownFlags", label: "Score known flags", kind: "numberList" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return weightedKnown(
    input.callerCriterionScores,
    input.callerCriterionWeights,
    input.scoreKnownFlags,
  );
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerCriterionScores: [80, 100],
  callerCriterionWeights: [3, 1],
  scoreKnownFlags: [1, 0],
} satisfies Input;
export const exampleOutput = {
  knownWeightedScore: 80,
  knownWeightFraction: 0.75,
  unknownIndices: [1],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "philately/exhibit-significance-weighted-score",
  title: "Exhibit Condition Philatelic Significance Weighted Score",
  description:
    "Aggregate independently assessed exhibit condition/significance scores under caller weights; unknown criteria remain explicit. Caller independently verifies observations, reference edition, units and applicability; not a grading-service certificate, authentication, conservation treatment, actual market price or legal/insurance entitlement.",
  inputs: inputFields,
  outputs: [
    { id: "knownWeightedScore", label: "Known weighted score", kind: "number" },
    {
      id: "knownWeightFraction",
      label: "Known weight fraction",
      kind: "number",
    },
    { id: "unknownIndices", label: "Unknown indices", kind: "numberList" },
  ],
  calculate: (value) =>
    calculate({
      callerCriterionScores: value.callerCriterionScores as readonly number[],
      callerCriterionWeights: value.callerCriterionWeights as readonly number[],
      scoreKnownFlags: value.scoreKnownFlags as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
