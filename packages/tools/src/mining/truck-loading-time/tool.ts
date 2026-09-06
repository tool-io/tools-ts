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
  readonly observedTruckLoadingStartMinutes: readonly number[];
  readonly observedTruckLoadingEndOrLastSeenMinutes: readonly number[];
  readonly observedTruckLoadingCompletionFlags: readonly number[];
}>;
export type Output = Readonly<{
  readonly completedPhaseDurationsMinutes: readonly number[];
  readonly rightCensoredPhaseLowerBoundsMinutes: readonly number[];
  readonly completedMeanPhaseMinutes: number;
}>;
const inputFields = [
  {
    id: "observedTruckLoadingStartMinutes",
    label: "Observed truck loading start minutes",
    kind: "numberList",
  },
  {
    id: "observedTruckLoadingEndOrLastSeenMinutes",
    label: "Observed truck loading end or last seen minutes",
    kind: "numberList",
  },
  {
    id: "observedTruckLoadingCompletionFlags",
    label: "Observed truck loading completion flags",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedTruckLoadingStartMinutes.forEach((v) =>
    nonnegative(v, "observedTruckLoadingStartMinutes"),
  );
  input.observedTruckLoadingEndOrLastSeenMinutes.forEach((v) =>
    nonnegative(v, "observedTruckLoadingEndOrLastSeenMinutes"),
  );
  binary(
    input.observedTruckLoadingCompletionFlags,
    "observedTruckLoadingCompletionFlags",
  );
  aligned(
    input.observedTruckLoadingStartMinutes,
    input.observedTruckLoadingEndOrLastSeenMinutes,
    "observedTruckLoadingStartMinutes",
  );
  aligned(
    input.observedTruckLoadingStartMinutes,
    input.observedTruckLoadingCompletionFlags,
    "observedTruckLoadingStartMinutes",
  );
  const duration = input.observedTruckLoadingStartMinutes.map((v, i) => {
      const d = input.observedTruckLoadingEndOrLastSeenMinutes[i] - v;
      nonnegative(d, "chronology");
      return d;
    }),
    complete = duration.filter(
      (_, i) => input.observedTruckLoadingCompletionFlags[i],
    );
  if (!complete.length)
    simpleError(
      "completed",
      "At least one actually completed phase for mean; right-censored durations separate.",
    );
  return {
    completedPhaseDurationsMinutes: complete,
    rightCensoredPhaseLowerBoundsMinutes: duration.filter(
      (_, i) => !input.observedTruckLoadingCompletionFlags[i],
    ),
    completedMeanPhaseMinutes: mean(complete),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedTruckLoadingStartMinutes: [1, 5],
  observedTruckLoadingEndOrLastSeenMinutes: [3, 8],
  observedTruckLoadingCompletionFlags: [1, 0],
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
  id: "mining/truck-loading-time",
  title: "Truck Loading Time Calculator",
  description:
    "Audit actual timestamped TruckLoading durations with right-censored ongoing phases, not predicted speed travel or full-cycle average with assumed complete phase observations. Caller independently verifies units, applicability and matching conditions; no operational recipe, safety certification, causal efficacy or legal/resource classification is inferred.",
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
      observedTruckLoadingStartMinutes:
        value.observedTruckLoadingStartMinutes as readonly number[],
      observedTruckLoadingEndOrLastSeenMinutes:
        value.observedTruckLoadingEndOrLastSeenMinutes as readonly number[],
      observedTruckLoadingCompletionFlags:
        value.observedTruckLoadingCompletionFlags as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
