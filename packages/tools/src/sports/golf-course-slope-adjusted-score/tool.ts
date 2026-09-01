import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive, aligned } from "../batch35-shared.js";
export type Input = Readonly<{
  readonly observedAdjustedGrossScores: readonly number[];
  readonly callerCourseRatings: readonly number[];
  readonly callerSlopeRatings: readonly number[];
  readonly callerPlayingConditionCorrections: readonly number[];
}>;
export type Output = Readonly<{
  readonly slopeAdjustedScoreDifferentials: readonly number[];
}>;
const inputFields = [
  {
    id: "observedAdjustedGrossScores",
    label: "Observed adjusted gross scores",
    kind: "numberList",
  },
  {
    id: "callerCourseRatings",
    label: "Caller course ratings",
    kind: "numberList",
  },
  {
    id: "callerSlopeRatings",
    label: "Caller slope ratings",
    kind: "numberList",
  },
  {
    id: "callerPlayingConditionCorrections",
    label: "Caller playing condition corrections",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.callerSlopeRatings.forEach((v) => positive(v, "callerSlopeRatings"));
  aligned(
    input.observedAdjustedGrossScores,
    input.callerCourseRatings,
    "observedAdjustedGrossScores",
  );
  aligned(
    input.observedAdjustedGrossScores,
    input.callerSlopeRatings,
    "observedAdjustedGrossScores",
  );
  aligned(
    input.observedAdjustedGrossScores,
    input.callerPlayingConditionCorrections,
    "observedAdjustedGrossScores",
  );
  return {
    slopeAdjustedScoreDifferentials: input.observedAdjustedGrossScores.map(
      (v, i) =>
        (113 / input.callerSlopeRatings[i]) *
        (v -
          input.callerCourseRatings[i] -
          input.callerPlayingConditionCorrections[i]),
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedAdjustedGrossScores: [90, 85],
  callerCourseRatings: [72, 70],
  callerSlopeRatings: [113, 130],
  callerPlayingConditionCorrections: [0, 1],
} satisfies Input;
export const exampleOutput = {
  slopeAdjustedScoreDifferentials: [18, 12.169230769230769],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "sports/golf-course-slope-adjusted-score",
  title: "Course Slope Adjusted Score Calculator",
  description:
    "Compute actual gross-score/course-rating/PCC slope-adjusted differentials, not lowest-score index selection or automatic course policy lookup.",
  inputs: inputFields,
  outputs: [
    {
      id: "slopeAdjustedScoreDifferentials",
      label: "Slope adjusted score differentials",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      observedAdjustedGrossScores:
        value.observedAdjustedGrossScores as readonly number[],
      callerCourseRatings: value.callerCourseRatings as readonly number[],
      callerSlopeRatings: value.callerSlopeRatings as readonly number[],
      callerPlayingConditionCorrections:
        value.callerPlayingConditionCorrections as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
