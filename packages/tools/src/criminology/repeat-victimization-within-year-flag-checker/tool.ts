import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  positive,
  nonnegative,
  aligned,
  unique,
} from "../batch46-shared.js";
export type Input = Readonly<{
  readonly callerEventIds: readonly string[];
  readonly callerVictimIds: readonly string[];
  readonly independentlyRecordedDayOffsets: readonly number[];
  readonly callerYearEndExclusive: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "callerEventIds", label: "Caller event ids", kind: "stringList" },
  { id: "callerVictimIds", label: "Caller victim ids", kind: "stringList" },
  {
    id: "independentlyRecordedDayOffsets",
    label: "Independently recorded day offsets",
    kind: "numberList",
  },
  {
    id: "callerYearEndExclusive",
    label: "Caller year end exclusive",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  unique(input.callerEventIds, "events");
  aligned(input.callerEventIds, input.callerVictimIds, "victims");
  aligned(input.callerEventIds, input.independentlyRecordedDayOffsets, "days");
  if (input.callerVictimIds.some((v) => !v.trim()))
    simpleError("victims", "Independent nonempty pseudonymous IDs.");
  positive(input.callerYearEndExclusive, "yearend");
  input.independentlyRecordedDayOffsets.forEach((v) => nonnegative(v, "day"));
  const ids = [...new Set(input.callerVictimIds)];
  return {
    repeatObservedVictimIds: ids.filter(
      (v) =>
        input.callerVictimIds.filter(
          (id, i) =>
            id === v &&
            input.independentlyRecordedDayOffsets[i] <
              input.callerYearEndExclusive,
        ).length >= 2,
    ),
    outsideWindowEventIds: input.callerEventIds.filter(
      (_, i) =>
        input.independentlyRecordedDayOffsets[i] >=
        input.callerYearEndExclusive,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    callerEventIds: ["e1", "e2", "e3"],
    callerVictimIds: ["a", "a", "b"],
    independentlyRecordedDayOffsets: [0, 10, 365],
    callerYearEndExclusive: 365,
  },
  output: {
    result: { repeatObservedVictimIds: ["a"], outsideWindowEventIds: ["e3"] },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "criminology/repeat-victimization-within-year-flag-checker",
  title: "Repeat Victimization Within Year Flag Checker",
  description:
    "Observed repeat victimization within caller established[0, year-end) day window, distinct events and stable pseudonymous victim IDs. Unknown/unreported incidents absent; no individual future risk inference.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated observation or qualified reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
