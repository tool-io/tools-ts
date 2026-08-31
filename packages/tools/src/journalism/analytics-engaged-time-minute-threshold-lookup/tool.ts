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
  positive,
  aligned,
  binary,
} from "../batch-shared.js";
export type Input = Readonly<{
  readonly observedSessionEngagedSeconds: readonly number[];
  readonly sessionCensoredFlags: readonly number[];
  readonly callerEngagementThresholdSeconds: number;
}>;
export type Output = Readonly<{
  readonly definitelyEngagedSessionIndices: readonly number[];
  readonly completeBelowThresholdSessionIndices: readonly number[];
  readonly censoredUndeterminedSessionIndices: readonly number[];
  readonly definiteEngagedShareLowerBoundFraction: number;
}>;
const inputFields = [
  {
    id: "observedSessionEngagedSeconds",
    label: "Observed session engaged seconds",
    kind: "numberList",
  },
  {
    id: "sessionCensoredFlags",
    label: "Session censored flags",
    kind: "numberList",
  },
  {
    id: "callerEngagementThresholdSeconds",
    label: "Caller engagement threshold seconds",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(
    input.callerEngagementThresholdSeconds,
    "callerEngagementThresholdSeconds",
  );
  input.observedSessionEngagedSeconds.forEach((v) =>
    nonnegative(v, "observedSessionEngagedSeconds"),
  );
  binary(input.sessionCensoredFlags, "sessionCensoredFlags");
  aligned(
    input.observedSessionEngagedSeconds,
    input.sessionCensoredFlags,
    "observedSessionEngagedSeconds",
  );
  if (!input.observedSessionEngagedSeconds.length)
    simpleError("sessions", "Observed session evidence required.");
  const engaged = input.observedSessionEngagedSeconds.flatMap((v, i) =>
      v >= input.callerEngagementThresholdSeconds ? [i] : [],
    ),
    below = input.observedSessionEngagedSeconds.flatMap((v, i) =>
      v < input.callerEngagementThresholdSeconds &&
      !input.sessionCensoredFlags[i]
        ? [i]
        : [],
    ),
    unknown = input.observedSessionEngagedSeconds.flatMap((v, i) =>
      v < input.callerEngagementThresholdSeconds &&
      input.sessionCensoredFlags[i]
        ? [i]
        : [],
    );
  return {
    definitelyEngagedSessionIndices: engaged,
    completeBelowThresholdSessionIndices: below,
    censoredUndeterminedSessionIndices: unknown,
    definiteEngagedShareLowerBoundFraction:
      engaged.length / input.observedSessionEngagedSeconds.length,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedSessionEngagedSeconds: [10, 60, 20],
  sessionCensoredFlags: [0, 1, 1],
  callerEngagementThresholdSeconds: 30,
} satisfies Input;
export const exampleOutput = {
  definitelyEngagedSessionIndices: [1],
  completeBelowThresholdSessionIndices: [0],
  censoredUndeterminedSessionIndices: [2],
  definiteEngagedShareLowerBoundFraction: 0.3333333333333333,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "journalism/analytics-engaged-time-minute-threshold-lookup",
  title: "Analytics Engaged Time Minute Threshold Lookup",
  description:
    "Audit observed engagement duration against caller threshold while retaining right-censored short sessions as undetermined; not complete-read rate, true attention measurement or an invented universal engagement minute standard.",
  inputs: inputFields,
  outputs: [
    {
      id: "definitelyEngagedSessionIndices",
      label: "Definitely engaged session indices",
      kind: "numberList",
    },
    {
      id: "completeBelowThresholdSessionIndices",
      label: "Complete below threshold session indices",
      kind: "numberList",
    },
    {
      id: "censoredUndeterminedSessionIndices",
      label: "Censored undetermined session indices",
      kind: "numberList",
    },
    {
      id: "definiteEngagedShareLowerBoundFraction",
      label: "Definite engaged share lower bound fraction",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedSessionEngagedSeconds:
        value.observedSessionEngagedSeconds as readonly number[],
      sessionCensoredFlags: value.sessionCensoredFlags as readonly number[],
      callerEngagementThresholdSeconds:
        value.callerEngagementThresholdSeconds as number,
    }),
});
export const run = tool.execute;
export default tool;
