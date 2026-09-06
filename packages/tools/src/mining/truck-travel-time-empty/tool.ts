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
  readonly observedEmptyTravelStartMinutes: readonly number[];
  readonly observedEmptyTravelEndOrLastSeenMinutes: readonly number[];
  readonly observedEmptyTravelCompletionFlags: readonly number[];
}>;
export type Output = Readonly<{
  readonly completedPhaseDurationsMinutes: readonly number[];
  readonly rightCensoredPhaseLowerBoundsMinutes: readonly number[];
  readonly completedMeanPhaseMinutes: number;
}>;
const inputFields = [
  {
    id: "observedEmptyTravelStartMinutes",
    label: "Observed empty travel start minutes",
    kind: "numberList",
  },
  {
    id: "observedEmptyTravelEndOrLastSeenMinutes",
    label: "Observed empty travel end or last seen minutes",
    kind: "numberList",
  },
  {
    id: "observedEmptyTravelCompletionFlags",
    label: "Observed empty travel completion flags",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedEmptyTravelStartMinutes.forEach((v) =>
    nonnegative(v, "observedEmptyTravelStartMinutes"),
  );
  input.observedEmptyTravelEndOrLastSeenMinutes.forEach((v) =>
    nonnegative(v, "observedEmptyTravelEndOrLastSeenMinutes"),
  );
  binary(
    input.observedEmptyTravelCompletionFlags,
    "observedEmptyTravelCompletionFlags",
  );
  aligned(
    input.observedEmptyTravelStartMinutes,
    input.observedEmptyTravelEndOrLastSeenMinutes,
    "observedEmptyTravelStartMinutes",
  );
  aligned(
    input.observedEmptyTravelStartMinutes,
    input.observedEmptyTravelCompletionFlags,
    "observedEmptyTravelStartMinutes",
  );
  const duration = input.observedEmptyTravelStartMinutes.map((v, i) => {
      const d = input.observedEmptyTravelEndOrLastSeenMinutes[i] - v;
      nonnegative(d, "chronology");
      return d;
    }),
    complete = duration.filter(
      (_, i) => input.observedEmptyTravelCompletionFlags[i],
    );
  if (!complete.length)
    simpleError(
      "completed",
      "At least one actually completed phase for mean; right-censored durations separate.",
    );
  return {
    completedPhaseDurationsMinutes: complete,
    rightCensoredPhaseLowerBoundsMinutes: duration.filter(
      (_, i) => !input.observedEmptyTravelCompletionFlags[i],
    ),
    completedMeanPhaseMinutes: mean(complete),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedEmptyTravelStartMinutes: [1, 5],
  observedEmptyTravelEndOrLastSeenMinutes: [3, 8],
  observedEmptyTravelCompletionFlags: [1, 0],
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
  id: "mining/truck-travel-time-empty",
  title: "Truck Travel Time Empty Calculator",
  description:
    "Audit actual timestamped EmptyTravel durations with right-censored ongoing phases, not predicted speed travel or full-cycle average with assumed complete phase observations. Caller independently verifies units, applicability and matching conditions; no operational recipe, safety certification, causal efficacy or legal/resource classification is inferred.",
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
      observedEmptyTravelStartMinutes:
        value.observedEmptyTravelStartMinutes as readonly number[],
      observedEmptyTravelEndOrLastSeenMinutes:
        value.observedEmptyTravelEndOrLastSeenMinutes as readonly number[],
      observedEmptyTravelCompletionFlags:
        value.observedEmptyTravelCompletionFlags as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
