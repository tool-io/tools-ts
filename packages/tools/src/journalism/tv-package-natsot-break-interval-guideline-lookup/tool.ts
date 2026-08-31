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
  sequence,
} from "../batch-shared.js";
export type Input = Readonly<{
  readonly packageDurationSeconds: number;
  readonly observedNatsotStartSeconds: readonly number[];
  readonly callerMaximumContinuousTrackSeconds: number;
}>;
export type Output = Readonly<{
  readonly trackIntervalLengthsSeconds: readonly number[];
  readonly trackIntervalsExceedingCallerPolicy: readonly number[];
}>;
const inputFields = [
  {
    id: "packageDurationSeconds",
    label: "Package duration seconds",
    kind: "number",
  },
  {
    id: "observedNatsotStartSeconds",
    label: "Observed natsot start seconds",
    kind: "numberList",
  },
  {
    id: "callerMaximumContinuousTrackSeconds",
    label: "Caller maximum continuous track seconds",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(
    input.callerMaximumContinuousTrackSeconds,
    "callerMaximumContinuousTrackSeconds",
  );
  nonnegative(input.packageDurationSeconds, "packageDurationSeconds");
  sequence(input.observedNatsotStartSeconds, "breaks");
  if (
    input.observedNatsotStartSeconds.some(
      (v) => v > input.packageDurationSeconds,
    )
  )
    simpleError("breaks", "Breaks must lie within observed package duration.");
  const bounds = [
      0,
      ...input.observedNatsotStartSeconds,
      input.packageDurationSeconds,
    ],
    intervals = bounds.slice(1).map((v, i) => v - bounds[i]);
  return {
    trackIntervalLengthsSeconds: intervals,
    trackIntervalsExceedingCallerPolicy: intervals.flatMap((v, i) =>
      v > input.callerMaximumContinuousTrackSeconds ? [i] : [],
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  packageDurationSeconds: 60,
  observedNatsotStartSeconds: [10, 30],
  callerMaximumContinuousTrackSeconds: 25,
} satisfies Input;
export const exampleOutput = {
  trackIntervalLengthsSeconds: [10, 20, 30],
  trackIntervalsExceedingCallerPolicy: [2],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "journalism/tv-package-natsot-break-interval-guideline-lookup",
  title: "TV Package Natsot Break Interval Guideline Lookup",
  description:
    "Audit actual package boundary-to-break and break-to-boundary intervals against caller maximum track budget, including opening/closing tails; unlike midroll minimum spacing this checks maximum uninterrupted track including boundaries. Start markers abstract zero-duration breaks.",
  inputs: inputFields,
  outputs: [
    {
      id: "trackIntervalLengthsSeconds",
      label: "Track interval lengths seconds",
      kind: "numberList",
    },
    {
      id: "trackIntervalsExceedingCallerPolicy",
      label: "Track intervals exceeding caller policy",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      packageDurationSeconds: value.packageDurationSeconds as number,
      observedNatsotStartSeconds:
        value.observedNatsotStartSeconds as readonly number[],
      callerMaximumContinuousTrackSeconds:
        value.callerMaximumContinuousTrackSeconds as number,
    }),
});
export const run = tool.execute;
export default tool;
