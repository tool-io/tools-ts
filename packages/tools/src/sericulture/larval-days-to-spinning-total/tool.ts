import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, nonnegative, dateShift } from "../shared.js";
export type Input = Readonly<{
  readonly feedingDurationsDays: readonly number[];
  readonly moltDurationsHours: readonly number[];
  readonly postFinalFeedToSpinningHours: number;
  readonly larvalStartDate: string;
}>;
export type Output = Readonly<{
  readonly totalLarvalDays: number;
  readonly modeledSpinningDate: string;
}>;
const inputFields = [
  {
    id: "feedingDurationsDays",
    label: "Feeding durations days",
    kind: "numberList",
  },
  {
    id: "moltDurationsHours",
    label: "Molt durations hours",
    kind: "numberList",
  },
  {
    id: "postFinalFeedToSpinningHours",
    label: "Post final feed to spinning hours",
    kind: "number",
  },
  { id: "larvalStartDate", label: "Larval start date", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.feedingDurationsDays.forEach((v) =>
    nonnegative(v, "feedingDurationsDays"),
  );
  input.moltDurationsHours.forEach((v) => nonnegative(v, "moltDurationsHours"));
  nonnegative(
    input.postFinalFeedToSpinningHours,
    "postFinalFeedToSpinningHours",
  );
  if (
    !input.feedingDurationsDays.length ||
    input.moltDurationsHours.length !== input.feedingDurationsDays.length - 1
  )
    simpleError(
      "moltDurationsHours",
      "One molt between each consecutive feeding instar required.",
    );
  const totalLarvalDays =
    input.feedingDurationsDays.reduce((a, b) => a + b, 0) +
    (input.moltDurationsHours.reduce((a, b) => a + b, 0) +
      input.postFinalFeedToSpinningHours) /
      24;
  return {
    totalLarvalDays,
    modeledSpinningDate: dateShift(
      input.larvalStartDate,
      Math.ceil(totalLarvalDays),
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  feedingDurationsDays: [2, 3, 4],
  moltDurationsHours: [12, 24],
  postFinalFeedToSpinningHours: 12,
  larvalStartDate: "2026-10-01",
} satisfies Input;
export const exampleOutput = {
  totalLarvalDays: 11,
  modeledSpinningDate: "2026-10-12",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "sericulture/larval-days-to-spinning-total",
  title: "Larval Days To Spinning Total",
  description:
    "Sum caller feeding, intervening molt and spinning-delay durations into a UTC calendar forecast, rounding up fractional completion days; no embedded strain-development schedule.",
  inputs: inputFields,
  outputs: [
    { id: "totalLarvalDays", label: "Total larval days", kind: "number" },
    {
      id: "modeledSpinningDate",
      label: "Modeled spinning date",
      kind: "string",
    },
  ],
  calculate: (value) =>
    calculate({
      feedingDurationsDays: value.feedingDurationsDays as readonly number[],
      moltDurationsHours: value.moltDurationsHours as readonly number[],
      postFinalFeedToSpinningHours:
        value.postFinalFeedToSpinningHours as number,
      larvalStartDate: value.larvalStartDate as string,
    }),
});
export const run = tool.execute;
export default tool;
