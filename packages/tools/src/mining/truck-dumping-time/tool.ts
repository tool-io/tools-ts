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
  readonly observedTruckDumpingStartMinutes: readonly number[];
  readonly observedTruckDumpingEndOrLastSeenMinutes: readonly number[];
  readonly observedTruckDumpingCompletionFlags: readonly number[];
}>;
export type Output = Readonly<{
  readonly completedPhaseDurationsMinutes: readonly number[];
  readonly rightCensoredPhaseLowerBoundsMinutes: readonly number[];
  readonly completedMeanPhaseMinutes: number;
}>;
const inputFields = [
  {
    id: "observedTruckDumpingStartMinutes",
    label: "Observed truck dumping start minutes",
    kind: "numberList",
  },
  {
    id: "observedTruckDumpingEndOrLastSeenMinutes",
    label: "Observed truck dumping end or last seen minutes",
    kind: "numberList",
  },
  {
    id: "observedTruckDumpingCompletionFlags",
    label: "Observed truck dumping completion flags",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedTruckDumpingStartMinutes.forEach((v) =>
    nonnegative(v, "observedTruckDumpingStartMinutes"),
  );
  input.observedTruckDumpingEndOrLastSeenMinutes.forEach((v) =>
    nonnegative(v, "observedTruckDumpingEndOrLastSeenMinutes"),
  );
  binary(
    input.observedTruckDumpingCompletionFlags,
    "observedTruckDumpingCompletionFlags",
  );
  aligned(
    input.observedTruckDumpingStartMinutes,
    input.observedTruckDumpingEndOrLastSeenMinutes,
    "observedTruckDumpingStartMinutes",
  );
  aligned(
    input.observedTruckDumpingStartMinutes,
    input.observedTruckDumpingCompletionFlags,
    "observedTruckDumpingStartMinutes",
  );
  const duration = input.observedTruckDumpingStartMinutes.map((v, i) => {
      const d = input.observedTruckDumpingEndOrLastSeenMinutes[i] - v;
      nonnegative(d, "chronology");
      return d;
    }),
    complete = duration.filter(
      (_, i) => input.observedTruckDumpingCompletionFlags[i],
    );
  if (!complete.length)
    simpleError(
      "completed",
      "At least one actually completed phase for mean; right-censored durations separate.",
    );
  return {
    completedPhaseDurationsMinutes: complete,
    rightCensoredPhaseLowerBoundsMinutes: duration.filter(
      (_, i) => !input.observedTruckDumpingCompletionFlags[i],
    ),
    completedMeanPhaseMinutes: mean(complete),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedTruckDumpingStartMinutes: [1, 5],
  observedTruckDumpingEndOrLastSeenMinutes: [3, 8],
  observedTruckDumpingCompletionFlags: [1, 0],
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
  id: "mining/truck-dumping-time",
  title: "Truck Dumping Time Calculator",
  description:
    "Audit actual timestamped TruckDumping durations with right-censored ongoing phases, not predicted speed travel or full-cycle average with assumed complete phase observations. Caller independently verifies units, applicability and matching conditions; no operational recipe, safety certification, causal efficacy or legal/resource classification is inferred.",
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
      observedTruckDumpingStartMinutes:
        value.observedTruckDumpingStartMinutes as readonly number[],
      observedTruckDumpingEndOrLastSeenMinutes:
        value.observedTruckDumpingEndOrLastSeenMinutes as readonly number[],
      observedTruckDumpingCompletionFlags:
        value.observedTruckDumpingCompletionFlags as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
