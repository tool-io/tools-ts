import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, nonnegative } from "../batch33-shared.js";
export type Input = Readonly<{
  readonly observedWeeklyDanceHours: readonly number[];
  readonly callerWeeklyReviewThresholdHours: number;
  readonly callerWeekToWeekIncreaseReviewFraction: number;
}>;
export type Output = Readonly<{
  readonly weeklyHoursAboveCallerReviewIndices: readonly number[];
  readonly weekToWeekIncreaseFractions: readonly number[];
  readonly weekIncreaseReviewIndices: readonly number[];
  readonly weeksWithoutIncreaseBaselineIndices: readonly number[];
}>;
const inputFields = [
  {
    id: "observedWeeklyDanceHours",
    label: "Observed weekly dance hours",
    kind: "numberList",
  },
  {
    id: "callerWeeklyReviewThresholdHours",
    label: "Caller weekly review threshold hours",
    kind: "number",
  },
  {
    id: "callerWeekToWeekIncreaseReviewFraction",
    label: "Caller week to week increase review fraction",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedWeeklyDanceHours.forEach((v) =>
    nonnegative(v, "observedWeeklyDanceHours"),
  );
  nonnegative(
    input.callerWeeklyReviewThresholdHours,
    "callerWeeklyReviewThresholdHours",
  );
  nonnegative(
    input.callerWeekToWeekIncreaseReviewFraction,
    "callerWeekToWeekIncreaseReviewFraction",
  );
  if (input.observedWeeklyDanceHours.length < 2)
    simpleError("weeks", "At least two actual weekly hour records required.");
  const ratios = input.observedWeeklyDanceHours
    .slice(1)
    .map((v, i) =>
      input.observedWeeklyDanceHours[i] === 0
        ? -1
        : (v - input.observedWeeklyDanceHours[i]) /
          input.observedWeeklyDanceHours[i],
    );
  return {
    weeklyHoursAboveCallerReviewIndices: input.observedWeeklyDanceHours.flatMap(
      (v, i) => (v > input.callerWeeklyReviewThresholdHours ? [i] : []),
    ),
    weekToWeekIncreaseFractions: ratios,
    weekIncreaseReviewIndices: ratios.flatMap((v, i) =>
      input.observedWeeklyDanceHours[i] > 0 &&
      v > input.callerWeekToWeekIncreaseReviewFraction
        ? [i + 1]
        : [],
    ),
    weeksWithoutIncreaseBaselineIndices: ratios.flatMap((_, i) =>
      input.observedWeeklyDanceHours[i] === 0 ? [i + 1] : [],
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedWeeklyDanceHours: [10, 12, 18],
  callerWeeklyReviewThresholdHours: 15,
  callerWeekToWeekIncreaseReviewFraction: 0.25,
} satisfies Input;
export const exampleOutput = {
  weeklyHoursAboveCallerReviewIndices: [2],
  weekToWeekIncreaseFractions: [0.2, 0.5],
  weekIncreaseReviewIndices: [2],
  weeksWithoutIncreaseBaselineIndices: [],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "dance/overuse-injury-weekly-hours-load-threshold-flag",
  title: "Overuse Injury Weekly Hours Load Threshold Flag",
  description:
    "Flag actual weekly dance-hour logs under independently supplied review triggers with absent zero-hour baseline retained −1 plus indices; not validated injury threshold, diagnosis, safe load or medical training advice.",
  inputs: inputFields,
  outputs: [
    {
      id: "weeklyHoursAboveCallerReviewIndices",
      label: "Weekly hours above caller review indices",
      kind: "numberList",
    },
    {
      id: "weekToWeekIncreaseFractions",
      label: "Week to week increase fractions",
      kind: "numberList",
    },
    {
      id: "weekIncreaseReviewIndices",
      label: "Week increase review indices",
      kind: "numberList",
    },
    {
      id: "weeksWithoutIncreaseBaselineIndices",
      label: "Weeks without increase baseline indices",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      observedWeeklyDanceHours:
        value.observedWeeklyDanceHours as readonly number[],
      callerWeeklyReviewThresholdHours:
        value.callerWeeklyReviewThresholdHours as number,
      callerWeekToWeekIncreaseReviewFraction:
        value.callerWeekToWeekIncreaseReviewFraction as number,
    }),
});
export const run = tool.execute;
export default tool;
