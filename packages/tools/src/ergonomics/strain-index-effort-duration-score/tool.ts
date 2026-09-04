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
  sum,
  interpolate,
} from "../batch39-shared.js";
export type Input = Readonly<{
  readonly observedEffortSeconds: readonly number[];
  readonly observationWindowSeconds: number;
  readonly callerDurationPercentCoordinates: readonly number[];
  readonly callerMatchedDurationMultipliers: readonly number[];
}>;
export type Output = Readonly<{
  readonly observedEffortPercent: number;
  readonly callerInterpolatedDurationMultiplier: number;
}>;
const inputFields = [
  {
    id: "observedEffortSeconds",
    label: "Observed effort seconds",
    kind: "numberList",
  },
  {
    id: "observationWindowSeconds",
    label: "Observation window seconds",
    kind: "number",
  },
  {
    id: "callerDurationPercentCoordinates",
    label: "Caller duration percent coordinates",
    kind: "numberList",
  },
  {
    id: "callerMatchedDurationMultipliers",
    label: "Caller matched duration multipliers",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.observationWindowSeconds, "observationWindowSeconds");
  input.observedEffortSeconds.forEach((v) =>
    nonnegative(v, "observedEffortSeconds"),
  );
  const p =
    (100 * sum(input.observedEffortSeconds)) / input.observationWindowSeconds;
  if (p > 100)
    simpleError(
      "overlap",
      "Nonoverlapping actual effort intervals within observation window.",
    );
  return {
    observedEffortPercent: p,
    callerInterpolatedDurationMultiplier: interpolate(
      input.callerDurationPercentCoordinates,
      input.callerMatchedDurationMultipliers,
      p,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedEffortSeconds: [2, 3],
  observationWindowSeconds: 20,
  callerDurationPercentCoordinates: [0, 25, 50, 100],
  callerMatchedDurationMultipliers: [0.5, 1, 2, 3],
} satisfies Input;
export const exampleOutput = {
  observedEffortPercent: 25,
  callerInterpolatedDurationMultiplier: 1,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "ergonomics/strain-index-effort-duration-score",
  title: "Strain Index Effort Duration Score Calculator",
  description:
    "Actual nonoverlapping effort-time occupancy with independently supplied duration-policy calibration; edition categorical steps must be represented externally, no hidden universal cutoffs. Caller independently establishes matching units, evidence, method edition and applicability; output is not compliance, diagnosis, work-safety approval, geological identity or validated hazard prediction.",
  inputs: inputFields,
  outputs: [
    {
      id: "observedEffortPercent",
      label: "Observed effort percent",
      kind: "number",
    },
    {
      id: "callerInterpolatedDurationMultiplier",
      label: "Caller interpolated duration multiplier",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedEffortSeconds: value.observedEffortSeconds as readonly number[],
      observationWindowSeconds: value.observationWindowSeconds as number,
      callerDurationPercentCoordinates:
        value.callerDurationPercentCoordinates as readonly number[],
      callerMatchedDurationMultipliers:
        value.callerMatchedDurationMultipliers as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
