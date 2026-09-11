import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch48-shared.js";
export type Input = Readonly<{
  readonly independentlyEstablishedOriginalAverageDailyDose: number;
  readonly actualOriginalAveragingDays: number;
  readonly callerIndependentlyApplicableTargetAveragingDays: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "independentlyEstablishedOriginalAverageDailyDose",
    label: "Independently established original average daily dose",
    kind: "number",
  },
  {
    id: "actualOriginalAveragingDays",
    label: "Actual original averaging days",
    kind: "number",
  },
  {
    id: "callerIndependentlyApplicableTargetAveragingDays",
    label: "Caller independently applicable target averaging days",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  nonnegative(input.independentlyEstablishedOriginalAverageDailyDose, "dose");
  positive(input.actualOriginalAveragingDays, "original-days");
  positive(
    input.callerIndependentlyApplicableTargetAveragingDays,
    "target-days",
  );
  return {
    conditionalReaveragedDailyDose:
      (input.independentlyEstablishedOriginalAverageDailyDose *
        input.actualOriginalAveragingDays) /
      input.callerIndependentlyApplicableTargetAveragingDays,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    independentlyEstablishedOriginalAverageDailyDose: 6,
    actualOriginalAveragingDays: 10,
    callerIndependentlyApplicableTargetAveragingDays: 20,
  },
  output: { result: { conditionalReaveragedDailyDose: 3 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "toxicology/averaging-time-adjustment",
  title: "Averaging Time Adjustment Calculator",
  description:
    "Same already integrated cumulative dose reaveraged onto an independently applicable target interval, not fabricate exposure-duration factors or replace route-specific reference conventions.",
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
