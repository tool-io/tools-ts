import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, aligned, unique } from "../batch41-shared.js";
export type Input = Readonly<{
  readonly callerSameReviewVisibleLearningEffectsIds: readonly string[];
  readonly callerSameReviewVisibleLearningEffectsEstimates: readonly number[];
}>;
export type Output = Readonly<{
  readonly callerDescendingCompetitionRanks: readonly number[];
}>;
const inputFields = [
  {
    id: "callerSameReviewVisibleLearningEffectsIds",
    label: "Caller same review visible learning effects ids",
    kind: "stringList",
  },
  {
    id: "callerSameReviewVisibleLearningEffectsEstimates",
    label: "Caller same review visible learning effects estimates",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  aligned(
    input.callerSameReviewVisibleLearningEffectsIds,
    input.callerSameReviewVisibleLearningEffectsEstimates,
    "callerSameReviewVisibleLearningEffectsIds",
  );
  unique(input.callerSameReviewVisibleLearningEffectsIds, "strategies");
  const v = input.callerSameReviewVisibleLearningEffectsEstimates;
  const sorted = [...v].sort((a, b) => b - a);
  return {
    callerDescendingCompetitionRanks: v.map((x) => sorted.indexOf(x) + 1),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerSameReviewVisibleLearningEffectsIds: ["a", "b", "c"],
  callerSameReviewVisibleLearningEffectsEstimates: [0.2, 0.6, 0.6],
} satisfies Input;
export const exampleOutput = {
  callerDescendingCompetitionRanks: [3, 1, 1],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "pedagogy/hattie-visible-learning-top-effect-sizes-bar-lookup",
  title: "Hattie Visible Learning Top Effect Sizes Bar Lookup",
  description:
    "Rank independently edition/review/comparison-matched reported instructional-effects, competition ties retained; not a universal causal teaching ranking, meta-analysis quality or cross outcome standardization. Caller independently verifies learner/context/evidence and reference edition; not causal learning efficacy, disability eligibility or educational certification.",
  inputs: inputFields,
  outputs: [
    {
      id: "callerDescendingCompetitionRanks",
      label: "Caller descending competition ranks",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      callerSameReviewVisibleLearningEffectsIds:
        value.callerSameReviewVisibleLearningEffectsIds as readonly string[],
      callerSameReviewVisibleLearningEffectsEstimates:
        value.callerSameReviewVisibleLearningEffectsEstimates as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
