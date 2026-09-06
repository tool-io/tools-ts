import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  aligned,
  binary,
  mean,
} from "../batch37-shared.js";
export type Input = Readonly<{
  readonly observedTruckSpottingStartMinutes: readonly number[];
  readonly observedTruckSpottingEndOrLastSeenMinutes: readonly number[];
  readonly observedTruckSpottingCompletionFlags: readonly number[];
}>;
export type Output = Readonly<{
  readonly completedPhaseDurationsMinutes: readonly number[];
  readonly rightCensoredPhaseLowerBoundsMinutes: readonly number[];
  readonly completedMeanPhaseMinutes: number;
}>;
const inputFields = [
  {
    id: "observedTruckSpottingStartMinutes",
    label: "Observed truck spotting start minutes",
    kind: "numberList",
  },
  {
    id: "observedTruckSpottingEndOrLastSeenMinutes",
    label: "Observed truck spotting end or last seen minutes",
    kind: "numberList",
  },
  {
    id: "observedTruckSpottingCompletionFlags",
    label: "Observed truck spotting completion flags",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedTruckSpottingStartMinutes.forEach((v) =>
    nonnegative(v, "observedTruckSpottingStartMinutes"),
  );
  input.observedTruckSpottingEndOrLastSeenMinutes.forEach((v) =>
    nonnegative(v, "observedTruckSpottingEndOrLastSeenMinutes"),
  );
  binary(
    input.observedTruckSpottingCompletionFlags,
    "observedTruckSpottingCompletionFlags",
  );
  aligned(
    input.observedTruckSpottingStartMinutes,
    input.observedTruckSpottingEndOrLastSeenMinutes,
    "observedTruckSpottingStartMinutes",
  );
  aligned(
    input.observedTruckSpottingStartMinutes,
    input.observedTruckSpottingCompletionFlags,
    "observedTruckSpottingStartMinutes",
  );
  const duration = input.observedTruckSpottingStartMinutes.map((v, i) => {
      const d = input.observedTruckSpottingEndOrLastSeenMinutes[i] - v;
      nonnegative(d, "chronology");
      return d;
    }),
    complete = duration.filter(
      (_, i) => input.observedTruckSpottingCompletionFlags[i],
    );
  if (!complete.length)
    simpleError(
      "completed",
      "At least one actually completed phase for mean; right-censored durations separate.",
    );
  return {
    completedPhaseDurationsMinutes: complete,
    rightCensoredPhaseLowerBoundsMinutes: duration.filter(
      (_, i) => !input.observedTruckSpottingCompletionFlags[i],
    ),
    completedMeanPhaseMinutes: mean(complete),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedTruckSpottingStartMinutes: [1, 5],
  observedTruckSpottingEndOrLastSeenMinutes: [3, 8],
  observedTruckSpottingCompletionFlags: [1, 0],
} satisfies Input;
export const exampleOutput = {
  completedPhaseDurationsMinutes: [2],
  rightCensoredPhaseLowerBoundsMinutes: [3],
  completedMeanPhaseMinutes: 2,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "mining/truck-spotting-time",
  title: "Truck Spotting Time Calculator",
  description:
    "Audit actual timestamped TruckSpotting durations with right-censored ongoing phases, not predicted speed travel or full-cycle average with assumed complete phase observations. Caller independently verifies units, applicability and matching conditions; no operational recipe, safety certification, causal efficacy or legal/resource classification is inferred.",
  inputs: inputFields,
  outputs: [
    {
      id: "completedPhaseDurationsMinutes",
      label: "Completed phase durations minutes",
      kind: "numberList",
    },
    {
      id: "rightCensoredPhaseLowerBoundsMinutes",
      label: "Right censored phase lower bounds minutes",
      kind: "numberList",
    },
    {
      id: "completedMeanPhaseMinutes",
      label: "Completed mean phase minutes",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedTruckSpottingStartMinutes:
        value.observedTruckSpottingStartMinutes as readonly number[],
      observedTruckSpottingEndOrLastSeenMinutes:
        value.observedTruckSpottingEndOrLastSeenMinutes as readonly number[],
      observedTruckSpottingCompletionFlags:
        value.observedTruckSpottingCompletionFlags as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
