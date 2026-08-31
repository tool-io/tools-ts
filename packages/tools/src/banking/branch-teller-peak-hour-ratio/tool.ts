import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  fraction,
  bounded,
  aligned,
} from "../batch-shared.js";
export type Input = Readonly<{
  readonly observedPeakArrivalCountsByHour: readonly number[];
  readonly callerMeanServiceMinutes: number;
  readonly callerMaximumUtilizationFraction: number;
  readonly observedScheduledTellerCounts: readonly number[];
}>;
export type Output = Readonly<{
  readonly requiredModeledTellerCounts: readonly number[];
  readonly signedScheduledMinusRequiredTellers: readonly number[];
}>;
const inputFields = [
  {
    id: "observedPeakArrivalCountsByHour",
    label: "Observed peak arrival counts by hour",
    kind: "numberList",
  },
  {
    id: "callerMeanServiceMinutes",
    label: "Caller mean service minutes",
    kind: "number",
  },
  {
    id: "callerMaximumUtilizationFraction",
    label: "Caller maximum utilization fraction",
    kind: "number",
  },
  {
    id: "observedScheduledTellerCounts",
    label: "Observed scheduled teller counts",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.callerMeanServiceMinutes, "callerMeanServiceMinutes");
  positive(
    input.callerMaximumUtilizationFraction,
    "callerMaximumUtilizationFraction",
  );
  fraction(
    input.callerMaximumUtilizationFraction,
    "callerMaximumUtilizationFraction",
  );
  aligned(
    input.observedPeakArrivalCountsByHour,
    input.observedScheduledTellerCounts,
    "observedPeakArrivalCountsByHour",
  );
  input.observedPeakArrivalCountsByHour.forEach((v) =>
    bounded(v, "arrivals", 0, 1000000),
  );
  input.observedScheduledTellerCounts.forEach((v) =>
    bounded(v, "tellers", 0, 1000000),
  );
  const required = input.observedPeakArrivalCountsByHour.map((v) =>
    bounded(
      Math.ceil(
        (v * input.callerMeanServiceMinutes) /
          (60 * input.callerMaximumUtilizationFraction),
      ),
      "requiredTellers",
      0,
      1000000,
    ),
  );
  return {
    requiredModeledTellerCounts: required,
    signedScheduledMinusRequiredTellers: required.map(
      (v, i) => input.observedScheduledTellerCounts[i] - v,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedPeakArrivalCountsByHour: [20, 30],
  callerMeanServiceMinutes: 5,
  callerMaximumUtilizationFraction: 0.75,
  observedScheduledTellerCounts: [2, 4],
} satisfies Input;
export const exampleOutput = {
  requiredModeledTellerCounts: [3, 4],
  signedScheduledMinusRequiredTellers: [-1, 0],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "banking/branch-teller-peak-hour-ratio",
  title: "Branch Teller Peak Hour Ratio Scheduler",
  description:
    "Screen observed peak-hour workload against explicit mean service time/utilization and actual scheduled tellers, retaining staffing deficit; deterministic capacity model, not queue-delay guarantee, labor policy or staffing recommendation.",
  inputs: inputFields,
  outputs: [
    {
      id: "requiredModeledTellerCounts",
      label: "Required modeled teller counts",
      kind: "numberList",
    },
    {
      id: "signedScheduledMinusRequiredTellers",
      label: "Signed scheduled minus required tellers",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      observedPeakArrivalCountsByHour:
        value.observedPeakArrivalCountsByHour as readonly number[],
      callerMeanServiceMinutes: value.callerMeanServiceMinutes as number,
      callerMaximumUtilizationFraction:
        value.callerMaximumUtilizationFraction as number,
      observedScheduledTellerCounts:
        value.observedScheduledTellerCounts as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
