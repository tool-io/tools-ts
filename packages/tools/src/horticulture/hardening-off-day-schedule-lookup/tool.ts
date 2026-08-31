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
  bounded,
  aligned,
  strictlyIncreasing,
  band,
} from "../batch34-shared.js";
export type Input = Readonly<{
  readonly observedDaysFromHardeningStart: readonly number[];
  readonly observedOutsideExposureHours: readonly number[];
  readonly callerMinimumExposureHoursByDay: readonly number[];
  readonly callerMaximumExposureHoursByDay: readonly number[];
}>;
export type Output = Readonly<{
  readonly hardeningDaysOutsideCallerExposurePlan: readonly number[];
  readonly signedExposureBandMarginsHours: readonly number[];
}>;
const inputFields = [
  {
    id: "observedDaysFromHardeningStart",
    label: "Observed days from hardening start",
    kind: "numberList",
  },
  {
    id: "observedOutsideExposureHours",
    label: "Observed outside exposure hours",
    kind: "numberList",
  },
  {
    id: "callerMinimumExposureHoursByDay",
    label: "Caller minimum exposure hours by day",
    kind: "numberList",
  },
  {
    id: "callerMaximumExposureHoursByDay",
    label: "Caller maximum exposure hours by day",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedOutsideExposureHours.forEach((v) =>
    nonnegative(v, "observedOutsideExposureHours"),
  );
  input.callerMinimumExposureHoursByDay.forEach((v) =>
    nonnegative(v, "callerMinimumExposureHoursByDay"),
  );
  input.callerMaximumExposureHoursByDay.forEach((v) =>
    nonnegative(v, "callerMaximumExposureHoursByDay"),
  );
  aligned(
    input.observedDaysFromHardeningStart,
    input.observedOutsideExposureHours,
    "observedDaysFromHardeningStart",
  );
  aligned(
    input.observedDaysFromHardeningStart,
    input.callerMinimumExposureHoursByDay,
    "observedDaysFromHardeningStart",
  );
  aligned(
    input.observedDaysFromHardeningStart,
    input.callerMaximumExposureHoursByDay,
    "observedDaysFromHardeningStart",
  );
  strictlyIncreasing(input.observedDaysFromHardeningStart, "days", 1);
  input.observedDaysFromHardeningStart.forEach((v) =>
    bounded(v, "day", 0, 366),
  );
  if (
    [
      ...input.observedOutsideExposureHours,
      ...input.callerMaximumExposureHoursByDay,
    ].some((v) => v > 24)
  )
    simpleError("hours", "Daily observed exposure at most 24h required.");
  const margins = input.observedOutsideExposureHours.map((v, i) =>
    band(
      v,
      input.callerMinimumExposureHoursByDay[i],
      input.callerMaximumExposureHoursByDay[i],
    ),
  );
  return {
    hardeningDaysOutsideCallerExposurePlan: margins.flatMap((v, i) =>
      v < 0 ? [input.observedDaysFromHardeningStart[i]] : [],
    ),
    signedExposureBandMarginsHours: margins,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedDaysFromHardeningStart: [0, 1, 2],
  observedOutsideExposureHours: [1, 2, 4],
  callerMinimumExposureHoursByDay: [1, 2, 3],
  callerMaximumExposureHoursByDay: [2, 3, 4],
} satisfies Input;
export const exampleOutput = {
  hardeningDaysOutsideCallerExposurePlan: [],
  signedExposureBandMarginsHours: [0, 0, 0],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "horticulture/hardening-off-day-schedule-lookup",
  title: "Hardening Off Day Schedule Lookup",
  description:
    "Audit actual hardening exposure log against caller independently established daily schedule; no universal hardening protocol, sun/wind/frost acclimation or transplant fitness guarantee.",
  inputs: inputFields,
  outputs: [
    {
      id: "hardeningDaysOutsideCallerExposurePlan",
      label: "Hardening days outside caller exposure plan",
      kind: "numberList",
    },
    {
      id: "signedExposureBandMarginsHours",
      label: "Signed exposure band margins hours",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      observedDaysFromHardeningStart:
        value.observedDaysFromHardeningStart as readonly number[],
      observedOutsideExposureHours:
        value.observedOutsideExposureHours as readonly number[],
      callerMinimumExposureHoursByDay:
        value.callerMinimumExposureHoursByDay as readonly number[],
      callerMaximumExposureHoursByDay:
        value.callerMaximumExposureHoursByDay as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
