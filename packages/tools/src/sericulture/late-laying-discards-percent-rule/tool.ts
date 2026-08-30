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
  fraction,
  count,
  aligned,
} from "../shared.js";
export type Input = Readonly<{
  readonly intervalStartHours: readonly number[];
  readonly intervalEndHours: readonly number[];
  readonly eggCountsByInterval: readonly number[];
  readonly callerLateLayingStartHour: number;
  readonly callerMaximumLateFraction: number;
}>;
export type Output = Readonly<{
  readonly lateEggCount: number;
  readonly lateOvipositionPercent: number;
  readonly aboveCallerLateFraction: boolean;
}>;
const inputFields = [
  {
    id: "intervalStartHours",
    label: "Interval start hours",
    kind: "numberList",
  },
  { id: "intervalEndHours", label: "Interval end hours", kind: "numberList" },
  {
    id: "eggCountsByInterval",
    label: "Egg counts by interval",
    kind: "numberList",
  },
  {
    id: "callerLateLayingStartHour",
    label: "Caller late laying start hour",
    kind: "number",
  },
  {
    id: "callerMaximumLateFraction",
    label: "Caller maximum late fraction",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.intervalStartHours.forEach((v) => nonnegative(v, "intervalStartHours"));
  input.intervalEndHours.forEach((v) => nonnegative(v, "intervalEndHours"));
  nonnegative(input.callerLateLayingStartHour, "callerLateLayingStartHour");
  fraction(input.callerMaximumLateFraction, "callerMaximumLateFraction");
  input.eggCountsByInterval.forEach((v) => count(v, "eggCountsByInterval"));
  aligned(
    input.intervalStartHours,
    input.intervalEndHours,
    "intervalStartHours",
  );
  aligned(
    input.intervalStartHours,
    input.eggCountsByInterval,
    "intervalStartHours",
  );
  input.intervalStartHours.forEach((v, i) => {
    if (
      input.intervalEndHours[i] <= v ||
      (i > 0 && v < input.intervalEndHours[i - 1]) ||
      (v < input.callerLateLayingStartHour &&
        input.intervalEndHours[i] > input.callerLateLayingStartHour)
    )
      simpleError(
        "intervalStartHours",
        "Ordered nonoverlapping bins must not straddle the late-laying boundary.",
      );
  });
  const total = positive(
      input.eggCountsByInterval.reduce((a, b) => a + b, 0),
      "eggCountsByInterval",
    ),
    lateEggCount = input.eggCountsByInterval.reduce(
      (s, v, i) =>
        s +
        (input.intervalStartHours[i] >= input.callerLateLayingStartHour
          ? v
          : 0),
      0,
    );
  return {
    lateEggCount,
    lateOvipositionPercent: (100 * lateEggCount) / total,
    aboveCallerLateFraction:
      lateEggCount / total > input.callerMaximumLateFraction,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  intervalStartHours: [0, 12, 24],
  intervalEndHours: [12, 24, 36],
  eggCountsByInterval: [100, 200, 100],
  callerLateLayingStartHour: 24,
  callerMaximumLateFraction: 0.2,
} satisfies Input;
export const exampleOutput = {
  lateEggCount: 100,
  lateOvipositionPercent: 25,
  aboveCallerLateFraction: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "sericulture/late-laying-discards-percent-rule",
  title: "Late Laying Discards Percent Rule Checker",
  description:
    "Audit observed late-laying share against supplied time/fraction policy without inventing within-bin allocation, discarding eggs or certifying viability.",
  inputs: inputFields,
  outputs: [
    { id: "lateEggCount", label: "Late egg count", kind: "number" },
    {
      id: "lateOvipositionPercent",
      label: "Late oviposition percent",
      kind: "number",
    },
    {
      id: "aboveCallerLateFraction",
      label: "Above caller late fraction",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      intervalStartHours: value.intervalStartHours as readonly number[],
      intervalEndHours: value.intervalEndHours as readonly number[],
      eggCountsByInterval: value.eggCountsByInterval as readonly number[],
      callerLateLayingStartHour: value.callerLateLayingStartHour as number,
      callerMaximumLateFraction: value.callerMaximumLateFraction as number,
    }),
});
export const run = tool.execute;
export default tool;
