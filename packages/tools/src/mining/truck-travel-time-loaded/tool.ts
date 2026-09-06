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
  readonly observedLoadedTravelStartMinutes: readonly number[];
  readonly observedLoadedTravelEndOrLastSeenMinutes: readonly number[];
  readonly observedLoadedTravelCompletionFlags: readonly number[];
}>;
export type Output = Readonly<{
  readonly completedPhaseDurationsMinutes: readonly number[];
  readonly rightCensoredPhaseLowerBoundsMinutes: readonly number[];
  readonly completedMeanPhaseMinutes: number;
}>;
const inputFields = [
  {
    id: "observedLoadedTravelStartMinutes",
    label: "Observed loaded travel start minutes",
    kind: "numberList",
  },
  {
    id: "observedLoadedTravelEndOrLastSeenMinutes",
    label: "Observed loaded travel end or last seen minutes",
    kind: "numberList",
  },
  {
    id: "observedLoadedTravelCompletionFlags",
    label: "Observed loaded travel completion flags",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedLoadedTravelStartMinutes.forEach((v) =>
    nonnegative(v, "observedLoadedTravelStartMinutes"),
  );
  input.observedLoadedTravelEndOrLastSeenMinutes.forEach((v) =>
    nonnegative(v, "observedLoadedTravelEndOrLastSeenMinutes"),
  );
  binary(
    input.observedLoadedTravelCompletionFlags,
    "observedLoadedTravelCompletionFlags",
  );
  aligned(
    input.observedLoadedTravelStartMinutes,
    input.observedLoadedTravelEndOrLastSeenMinutes,
    "observedLoadedTravelStartMinutes",
  );
  aligned(
    input.observedLoadedTravelStartMinutes,
    input.observedLoadedTravelCompletionFlags,
    "observedLoadedTravelStartMinutes",
  );
  const duration = input.observedLoadedTravelStartMinutes.map((v, i) => {
      const d = input.observedLoadedTravelEndOrLastSeenMinutes[i] - v;
      nonnegative(d, "chronology");
      return d;
    }),
    complete = duration.filter(
      (_, i) => input.observedLoadedTravelCompletionFlags[i],
    );
  if (!complete.length)
    simpleError(
      "completed",
      "At least one actually completed phase for mean; right-censored durations separate.",
    );
  return {
    completedPhaseDurationsMinutes: complete,
    rightCensoredPhaseLowerBoundsMinutes: duration.filter(
      (_, i) => !input.observedLoadedTravelCompletionFlags[i],
    ),
    completedMeanPhaseMinutes: mean(complete),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedLoadedTravelStartMinutes: [1, 5],
  observedLoadedTravelEndOrLastSeenMinutes: [3, 8],
  observedLoadedTravelCompletionFlags: [1, 0],
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
  id: "mining/truck-travel-time-loaded",
  title: "Truck Travel Time Loaded Calculator",
  description:
    "Audit actual timestamped LoadedTravel durations with right-censored ongoing phases, not predicted speed travel or full-cycle average with assumed complete phase observations. Caller independently verifies units, applicability and matching conditions; no operational recipe, safety certification, causal efficacy or legal/resource classification is inferred.",
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
      observedLoadedTravelStartMinutes:
        value.observedLoadedTravelStartMinutes as readonly number[],
      observedLoadedTravelEndOrLastSeenMinutes:
        value.observedLoadedTravelEndOrLastSeenMinutes as readonly number[],
      observedLoadedTravelCompletionFlags:
        value.observedLoadedTravelCompletionFlags as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
