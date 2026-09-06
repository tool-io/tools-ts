import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, aligned, unique } from "../batch41-shared.js";
export type Input = Readonly<{
  readonly callerSameReviewInstructionalStrategyEffectsIds: readonly string[];
  readonly callerSameReviewInstructionalStrategyEffectsEstimates: readonly number[];
}>;
export type Output = Readonly<{
  readonly callerDescendingCompetitionRanks: readonly number[];
}>;
const inputFields = [
  {
    id: "callerSameReviewInstructionalStrategyEffectsIds",
    label: "Caller same review instructional strategy effects ids",
    kind: "stringList",
  },
  {
    id: "callerSameReviewInstructionalStrategyEffectsEstimates",
    label: "Caller same review instructional strategy effects estimates",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  aligned(
    input.callerSameReviewInstructionalStrategyEffectsIds,
    input.callerSameReviewInstructionalStrategyEffectsEstimates,
    "callerSameReviewInstructionalStrategyEffectsIds",
  );
  unique(input.callerSameReviewInstructionalStrategyEffectsIds, "strategies");
  const v = input.callerSameReviewInstructionalStrategyEffectsEstimates;
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
  callerSameReviewInstructionalStrategyEffectsIds: ["a", "b", "c"],
  callerSameReviewInstructionalStrategyEffectsEstimates: [0.2, 0.6, 0.6],
} satisfies Input;
export const exampleOutput = {
  callerDescendingCompetitionRanks: [3, 1, 1],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "pedagogy/marzano-nine-instructional-strategies-rankings-lookup",
  title: "Marzano Nine Instructional Strategies Rankings Lookup",
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
      callerSameReviewInstructionalStrategyEffectsIds:
        value.callerSameReviewInstructionalStrategyEffectsIds as readonly string[],
      callerSameReviewInstructionalStrategyEffectsEstimates:
        value.callerSameReviewInstructionalStrategyEffectsEstimates as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
