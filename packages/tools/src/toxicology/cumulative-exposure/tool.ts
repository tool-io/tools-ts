import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  aligned,
  positive,
  nonnegative,
  sum,
} from "../batch48-shared.js";
export type Input = Readonly<{
  readonly actualIntervalDosesMgPerKg: readonly number[];
  readonly actualIntervalDurationsDays: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualIntervalDosesMgPerKg",
    label: "Actual interval doses mg per kg",
    kind: "numberList",
  },
  {
    id: "actualIntervalDurationsDays",
    label: "Actual interval durations days",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  aligned(
    input.actualIntervalDosesMgPerKg,
    input.actualIntervalDurationsDays,
    "intervals",
  );
  input.actualIntervalDosesMgPerKg.forEach((v) => nonnegative(v, "daily-dose"));
  input.actualIntervalDurationsDays.forEach((v) => positive(v, "days"));
  const t = sum(
    input.actualIntervalDosesMgPerKg.map(
      (v, i) => v * input.actualIntervalDurationsDays[i],
    ),
  );
  return {
    observedCumulativeDoseMgPerKg: t,
    observedTimeWeightedDailyDoseMgPerKg:
      t / positive(sum(input.actualIntervalDurationsDays), "duration"),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualIntervalDosesMgPerKg: [1, 2],
    actualIntervalDurationsDays: [2, 3],
  },
  output: {
    result: {
      observedCumulativeDoseMgPerKg: 8,
      observedTimeWeightedDailyDoseMgPerKg: 1.6,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "toxicology/cumulative-exposure",
  title: "Cumulative Exposure Calculator",
  description:
    "Actual disjoint interval daily-dose\u00d7elapsed-day cumulative dose with complete interval accounting; not a lifetime average, administered-versus-absorbed conversion or cumulative harm prediction.",
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
