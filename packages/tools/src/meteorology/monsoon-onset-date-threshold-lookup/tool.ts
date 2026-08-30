import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  count,
  maximum,
  runs,
} from "../shared.js";

export type Input = Readonly<{
  readonly dailyPrecipitationMm: readonly number[];
  readonly callerMinimumWetRunDays: number;
  readonly callerWetDayThresholdMm: number;
  readonly callerFollowingDryWindowDays: number;
  readonly callerMaximumConsecutiveDryDays: number;
}>;
export type Output = Readonly<{
  readonly candidateOnsetIndices: readonly number[];
  readonly acceptedOnsetIndices: readonly number[];
  readonly firstAcceptedOnsetIndex: number;
  readonly acceptedOnsetFound: boolean;
}>;
const inputFields = [
  {
    id: "dailyPrecipitationMm",
    label: "Daily precipitation mm",
    kind: "numberList",
  },
  {
    id: "callerMinimumWetRunDays",
    label: "Caller minimum wet run days",
    kind: "integer",
  },
  {
    id: "callerWetDayThresholdMm",
    label: "Caller wet day threshold mm",
    kind: "number",
  },
  {
    id: "callerFollowingDryWindowDays",
    label: "Caller following dry window days",
    kind: "integer",
  },
  {
    id: "callerMaximumConsecutiveDryDays",
    label: "Caller maximum consecutive dry days",
    kind: "integer",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.callerMinimumWetRunDays, "callerMinimumWetRunDays");
  positive(input.callerWetDayThresholdMm, "callerWetDayThresholdMm");
  positive(input.callerFollowingDryWindowDays, "callerFollowingDryWindowDays");
  input.dailyPrecipitationMm.forEach((v) =>
    nonnegative(v, "dailyPrecipitationMm"),
  );
  count(input.callerMinimumWetRunDays, "callerMinimumWetRunDays");
  count(input.callerFollowingDryWindowDays, "callerFollowingDryWindowDays");
  count(
    input.callerMaximumConsecutiveDryDays,
    "callerMaximumConsecutiveDryDays",
  );
  const candidates = runs(
    input.dailyPrecipitationMm.map((v) => v >= input.callerWetDayThresholdMm),
    input.callerMinimumWetRunDays,
  ).starts;
  if (
    input.dailyPrecipitationMm.length * input.callerFollowingDryWindowDays >
    1000000
  )
    simpleError(
      "window",
      "Bounded one-million onset screening operations required.",
    );
  const accepted = candidates.filter((start) => {
    const lo = start + input.callerMinimumWetRunDays,
      hi = lo + input.callerFollowingDryWindowDays;
    if (hi > input.dailyPrecipitationMm.length) return false;
    const dry = runs(
      input.dailyPrecipitationMm
        .slice(lo, hi)
        .map((v) => v < input.callerWetDayThresholdMm),
    ).lengths;
    return (
      (dry.length ? maximum(dry) : 0) <= input.callerMaximumConsecutiveDryDays
    );
  });
  return {
    candidateOnsetIndices: candidates,
    acceptedOnsetIndices: accepted,
    firstAcceptedOnsetIndex: accepted[0] ?? -1,
    acceptedOnsetFound: accepted.length > 0,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  dailyPrecipitationMm: [0, 5, 10, 0, 0, 3],
  callerMinimumWetRunDays: 2,
  callerWetDayThresholdMm: 5,
  callerFollowingDryWindowDays: 2,
  callerMaximumConsecutiveDryDays: 1,
} satisfies Input;
export const exampleOutput = {
  candidateOnsetIndices: [1],
  acceptedOnsetIndices: [],
  firstAcceptedOnsetIndex: -1,
  acceptedOnsetFound: false,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "meteorology/monsoon-onset-date-threshold-lookup",
  title: "Monsoon Onset Date Threshold Lookup",
  description:
    "Audit caller monsoon-onset wet-run and following dry-break policy with fully observed confirmation window; incomplete future windows cannot confirm onset and no regional calendar is embedded.",
  inputs: inputFields,
  outputs: [
    {
      id: "candidateOnsetIndices",
      label: "Candidate onset indices",
      kind: "numberList",
    },
    {
      id: "acceptedOnsetIndices",
      label: "Accepted onset indices",
      kind: "numberList",
    },
    {
      id: "firstAcceptedOnsetIndex",
      label: "First accepted onset index",
      kind: "number",
    },
    {
      id: "acceptedOnsetFound",
      label: "Accepted onset found",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      dailyPrecipitationMm: value.dailyPrecipitationMm as readonly number[],
      callerMinimumWetRunDays: value.callerMinimumWetRunDays as number,
      callerWetDayThresholdMm: value.callerWetDayThresholdMm as number,
      callerFollowingDryWindowDays:
        value.callerFollowingDryWindowDays as number,
      callerMaximumConsecutiveDryDays:
        value.callerMaximumConsecutiveDryDays as number,
    }),
});
export const run = tool.execute;
export default tool;
