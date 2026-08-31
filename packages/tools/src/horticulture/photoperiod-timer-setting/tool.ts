import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, bounded, clock } from "../batch34-shared.js";
export type Input = Readonly<{
  readonly callerLightOnMinuteOfDay: number;
  readonly callerRequestedOnMinutes: number;
  readonly observedTimerOnMinuteOfDay: number;
  readonly observedTimerOffMinuteOfDay: number;
}>;
export type Output = Readonly<{
  readonly plannedOffMinuteOfDay: number;
  readonly plannedCrossesMidnight: boolean;
  readonly observedTimerOnMinutes: number;
  readonly signedObservedMinusRequestedMinutes: number;
}>;
const inputFields = [
  {
    id: "callerLightOnMinuteOfDay",
    label: "Caller light on minute of day",
    kind: "number",
  },
  {
    id: "callerRequestedOnMinutes",
    label: "Caller requested on minutes",
    kind: "number",
  },
  {
    id: "observedTimerOnMinuteOfDay",
    label: "Observed timer on minute of day",
    kind: "number",
  },
  {
    id: "observedTimerOffMinuteOfDay",
    label: "Observed timer off minute of day",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  clock(input.callerLightOnMinuteOfDay);
  clock(input.observedTimerOnMinuteOfDay);
  clock(input.observedTimerOffMinuteOfDay);
  bounded(input.callerRequestedOnMinutes, "onDuration", 1, 1439);
  const end = input.callerLightOnMinuteOfDay + input.callerRequestedOnMinutes,
    observed =
      (input.observedTimerOffMinuteOfDay -
        input.observedTimerOnMinuteOfDay +
        1440) %
      1440;
  return {
    plannedOffMinuteOfDay: end % 1440,
    plannedCrossesMidnight: end >= 1440,
    observedTimerOnMinutes: observed,
    signedObservedMinusRequestedMinutes:
      observed - input.callerRequestedOnMinutes,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerLightOnMinuteOfDay: 1080,
  callerRequestedOnMinutes: 720,
  observedTimerOnMinuteOfDay: 1080,
  observedTimerOffMinuteOfDay: 360,
} satisfies Input;
export const exampleOutput = {
  plannedOffMinuteOfDay: 360,
  plannedCrossesMidnight: true,
  observedTimerOnMinutes: 720,
  signedObservedMinusRequestedMinutes: 0,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "horticulture/photoperiod-timer-setting",
  title: "Photoperiod Timer Setting Calculator",
  description:
    "Plan/audit actual daily timer minutes across midnight; 1–1439 requested minutes and same-zone fixed 24h clock, equal observed endpoints mean zero not inferred all-day, no photoperiod recommendation or DST inference.",
  inputs: inputFields,
  outputs: [
    {
      id: "plannedOffMinuteOfDay",
      label: "Planned off minute of day",
      kind: "number",
    },
    {
      id: "plannedCrossesMidnight",
      label: "Planned crosses midnight",
      kind: "boolean",
    },
    {
      id: "observedTimerOnMinutes",
      label: "Observed timer on minutes",
      kind: "number",
    },
    {
      id: "signedObservedMinusRequestedMinutes",
      label: "Signed observed minus requested minutes",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      callerLightOnMinuteOfDay: value.callerLightOnMinuteOfDay as number,
      callerRequestedOnMinutes: value.callerRequestedOnMinutes as number,
      observedTimerOnMinuteOfDay: value.observedTimerOnMinuteOfDay as number,
      observedTimerOffMinuteOfDay: value.observedTimerOffMinuteOfDay as number,
    }),
});
export const run = tool.execute;
export default tool;
