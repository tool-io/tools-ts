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
  ordered,
  maximum,
  minimum,
} from "../shared.js";
export type Input = Readonly<{
  readonly sampleHours: readonly number[];
  readonly observedRhPercent: readonly number[];
  readonly callerDailyRhRangeLimitPercent: number;
  readonly callerRhSlewLimitPercentPerHour: number;
}>;
export type Output = Readonly<{
  readonly observedDailyRhRangePercent: number;
  readonly maximumObservedRhSlewPercentPerHour: number;
  readonly aboveCallerRangeLimit: boolean;
  readonly aboveCallerSlewLimit: boolean;
}>;
const inputFields = [
  { id: "sampleHours", label: "Sample hours", kind: "numberList" },
  { id: "observedRhPercent", label: "Observed rh percent", kind: "numberList" },
  {
    id: "callerDailyRhRangeLimitPercent",
    label: "Caller daily rh range limit percent",
    kind: "number",
  },
  {
    id: "callerRhSlewLimitPercentPerHour",
    label: "Caller rh slew limit percent per hour",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  nonnegative(
    input.callerDailyRhRangeLimitPercent,
    "callerDailyRhRangeLimitPercent",
  );
  nonnegative(
    input.callerRhSlewLimitPercentPerHour,
    "callerRhSlewLimitPercentPerHour",
  );
  aligned(input.sampleHours, input.observedRhPercent, "sampleHours");
  ordered(input.sampleHours, "hours");
  if (
    input.sampleHours[0] !== 0 ||
    input.sampleHours.at(-1)! !== 24 ||
    input.observedRhPercent.some((v) => v < 0 || v > 100)
  )
    simpleError(
      "day",
      "Caller complete 0–24h coverage and RH in [0,100] required.",
    );
  const r = maximum(input.observedRhPercent) - minimum(input.observedRhPercent),
    slew = maximum(
      input.observedRhPercent
        .slice(1)
        .map(
          (v, i) =>
            Math.abs(v - input.observedRhPercent[i]) /
            (input.sampleHours[i + 1] - input.sampleHours[i]),
        ),
    );
  return {
    observedDailyRhRangePercent: r,
    maximumObservedRhSlewPercentPerHour: slew,
    aboveCallerRangeLimit: r > input.callerDailyRhRangeLimitPercent,
    aboveCallerSlewLimit: slew > input.callerRhSlewLimitPercentPerHour,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  sampleHours: [0, 12, 24],
  observedRhPercent: [40, 50, 40],
  callerDailyRhRangeLimitPercent: 8,
  callerRhSlewLimitPercentPerHour: 1,
} satisfies Input;
export const exampleOutput = {
  observedDailyRhRangePercent: 10,
  maximumObservedRhSlewPercentPerHour: 0.8333333333333334,
  aboveCallerRangeLimit: true,
  aboveCallerSlewLimit: false,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "museology/rh-fluctuation-band-checker",
  title: "RH Daily Fluctuation Tolerance Band Checker",
  description:
    "Audit observed full-day RH range and resolved maximum slew as distinct caller fluctuation criteria; unresolved intersample extremes remain unknown.",
  inputs: inputFields,
  outputs: [
    {
      id: "observedDailyRhRangePercent",
      label: "Observed daily rh range percent",
      kind: "number",
    },
    {
      id: "maximumObservedRhSlewPercentPerHour",
      label: "Maximum observed rh slew percent per hour",
      kind: "number",
    },
    {
      id: "aboveCallerRangeLimit",
      label: "Above caller range limit",
      kind: "boolean",
    },
    {
      id: "aboveCallerSlewLimit",
      label: "Above caller slew limit",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      sampleHours: value.sampleHours as readonly number[],
      observedRhPercent: value.observedRhPercent as readonly number[],
      callerDailyRhRangeLimitPercent:
        value.callerDailyRhRangeLimitPercent as number,
      callerRhSlewLimitPercentPerHour:
        value.callerRhSlewLimitPercentPerHour as number,
    }),
});
export const run = tool.execute;
export default tool;
