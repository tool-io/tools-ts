import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  count,
  aligned,
  binary,
  sum,
  totalCount,
} from "../shared.js";
export type Input = Readonly<{
  readonly observedActionCounts: readonly number[];
  readonly qualifyingTechnicalActionFlags: readonly number[];
  readonly observedActiveMinutes: readonly number[];
  readonly callerMaximumTechnicalActionsPerMinute: number;
}>;
export type Output = Readonly<{
  readonly totalQualifyingTechnicalActions: number;
  readonly observedActiveMinuteFrequency: number;
  readonly aboveCallerFrequencyLimit: boolean;
}>;
const inputFields = [
  {
    id: "observedActionCounts",
    label: "Observed action counts",
    kind: "numberList",
  },
  {
    id: "qualifyingTechnicalActionFlags",
    label: "Qualifying technical action flags",
    kind: "numberList",
  },
  {
    id: "observedActiveMinutes",
    label: "Observed active minutes",
    kind: "numberList",
  },
  {
    id: "callerMaximumTechnicalActionsPerMinute",
    label: "Caller maximum technical actions per minute",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedActiveMinutes.forEach((v) =>
    positive(v, "observedActiveMinutes"),
  );
  nonnegative(
    input.callerMaximumTechnicalActionsPerMinute,
    "callerMaximumTechnicalActionsPerMinute",
  );
  input.observedActionCounts.forEach((v) => count(v, "observedActionCounts"));
  aligned(
    input.observedActionCounts,
    input.qualifyingTechnicalActionFlags,
    "observedActionCounts",
  );
  aligned(
    input.observedActionCounts,
    input.observedActiveMinutes,
    "observedActionCounts",
  );
  binary(input.qualifyingTechnicalActionFlags, "qualifying");
  const n = totalCount(
      input.observedActionCounts.map(
        (v, i) => v * input.qualifyingTechnicalActionFlags[i],
      ),
      "actions",
    ),
    rate = n / sum(input.observedActiveMinutes);
  return {
    totalQualifyingTechnicalActions: n,
    observedActiveMinuteFrequency: rate,
    aboveCallerFrequencyLimit:
      rate > input.callerMaximumTechnicalActionsPerMinute,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedActionCounts: [10, 20],
  qualifyingTechnicalActionFlags: [1, 0],
  observedActiveMinutes: [2, 3],
  callerMaximumTechnicalActionsPerMinute: 4,
} satisfies Input;
export const exampleOutput = {
  totalQualifyingTechnicalActions: 10,
  observedActiveMinuteFrequency: 2,
  aboveCallerFrequencyLimit: false,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "ergonomics/ocra-action-frequency-per-minute",
  title: "OCRA Technical Action Frequency per Minute Calculator",
  description:
    "Aggregate observed technical actions under caller classification and actual active-time denominator, not all movements or clock-shift time; does not compute a full OCRA index or safe repetitive-work limit.",
  inputs: inputFields,
  outputs: [
    {
      id: "totalQualifyingTechnicalActions",
      label: "Total qualifying technical actions",
      kind: "number",
    },
    {
      id: "observedActiveMinuteFrequency",
      label: "Observed active minute frequency",
      kind: "number",
    },
    {
      id: "aboveCallerFrequencyLimit",
      label: "Above caller frequency limit",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      observedActionCounts: value.observedActionCounts as readonly number[],
      qualifyingTechnicalActionFlags:
        value.qualifyingTechnicalActionFlags as readonly number[],
      observedActiveMinutes: value.observedActiveMinutes as readonly number[],
      callerMaximumTechnicalActionsPerMinute:
        value.callerMaximumTechnicalActionsPerMinute as number,
    }),
});
export const run = tool.execute;
export default tool;
