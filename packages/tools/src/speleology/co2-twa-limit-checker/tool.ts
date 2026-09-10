import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  weightedMean,
} from "../batch48-shared.js";
export type Input = Readonly<{
  readonly actualCo2IntervalPpm: readonly number[];
  readonly actualIntervalHours: readonly number[];
  readonly callerApplicableTwaLimitPpm: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualCo2IntervalPpm",
    label: "Actual co2 interval ppm",
    kind: "numberList",
  },
  {
    id: "actualIntervalHours",
    label: "Actual interval hours",
    kind: "numberList",
  },
  {
    id: "callerApplicableTwaLimitPpm",
    label: "Caller applicable twa limit ppm",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  input.actualCo2IntervalPpm.forEach((v) => nonnegative(v, "ppm"));
  input.actualIntervalHours.forEach((v) => positive(v, "hours"));
  positive(input.callerApplicableTwaLimitPpm, "independent-limit");
  const m = weightedMean(input.actualCo2IntervalPpm, input.actualIntervalHours);
  return {
    observedCompleteIntervalTwaPpm: m,
    signedCallerTwaMarginPpm: input.callerApplicableTwaLimitPpm - m,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualCo2IntervalPpm: [100, 200],
    actualIntervalHours: [1, 3],
    callerApplicableTwaLimitPpm: 150,
  },
  output: {
    result: {
      observedCompleteIntervalTwaPpm: 175,
      signedCallerTwaMarginPpm: -25,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "speleology/co2-twa-limit-checker",
  title: "CO2 Exposure Time-Weighted Limit Checker",
  description:
    "Actual complete cave CO2observed interval weighted mean, versus independently applicable same-durationTWA. No unknown interval zero fill, short-term/ceiling substitution or safe-entry approval.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Qualified observed calculation or explicit reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
