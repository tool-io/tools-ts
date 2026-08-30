import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly criteria: readonly string[];
  readonly earnedPoints: readonly number[];
  readonly possiblePoints: readonly number[];
  readonly minimumCriterionFraction: number;
}>;
export type Output = Readonly<{
  readonly totalPoints: number;
  readonly maximumPoints: number;
  readonly belowTargetCriteria: readonly string[];
}>;
export const calculate = (input: Input): Output => {
  const n = input.criteria.length;
  if (
    !n ||
    n !== input.earnedPoints.length ||
    n !== input.possiblePoints.length ||
    new Set(input.criteria).size !== n ||
    input.minimumCriterionFraction < 0 ||
    input.minimumCriterionFraction > 1 ||
    input.possiblePoints.some(
      (v, i) =>
        v <= 0 || input.earnedPoints[i] < 0 || input.earnedPoints[i] > v,
    )
  )
    simpleError(
      "earnedPoints",
      "Distinct criteria and earned points within positive maxima required.",
    );
  return {
    totalPoints: input.earnedPoints.reduce((a, b) => a + b, 0),
    maximumPoints: input.possiblePoints.reduce((a, b) => a + b, 0),
    belowTargetCriteria: input.criteria.filter(
      (_, i) =>
        input.earnedPoints[i] / input.possiblePoints[i] <
        input.minimumCriterionFraction,
    ),
  };
};
export const exampleInput = {
  criteria: ["evidence", "respect"],
  earnedPoints: [3, 2],
  possiblePoints: [4, 4],
  minimumCriterionFraction: 0.6,
} satisfies Input;
export const exampleOutput = {
  totalPoints: 5,
  maximumPoints: 8,
  belowTargetCriteria: ["respect"],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "pedagogy/discussion-rubric-score",
  title: "Discussion Rubric Score",
  description:
    "Score asynchronous discussion criteria and flag low-scoring rubric dimensions.",
  inputs: [
    { id: "criteria", label: "Criteria", kind: "stringList" },
    { id: "earnedPoints", label: "Earned points", kind: "numberList" },
    { id: "possiblePoints", label: "Possible points", kind: "numberList" },
    {
      id: "minimumCriterionFraction",
      label: "Minimum criterion fraction",
      kind: "number",
    },
  ],
  outputs: [
    { id: "totalPoints", label: "Total points", kind: "number" },
    { id: "maximumPoints", label: "Maximum points", kind: "number" },
    {
      id: "belowTargetCriteria",
      label: "Below target criteria",
      kind: "stringList",
    },
  ],
  calculate: (value) =>
    calculate({
      criteria: value.criteria as readonly string[],
      earnedPoints: value.earnedPoints as readonly number[],
      possiblePoints: value.possiblePoints as readonly number[],
      minimumCriterionFraction: value.minimumCriterionFraction as number,
    }),
});
export const run = tool.execute;
export default tool;
